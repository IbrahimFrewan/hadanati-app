// Typed data-access layer for the nursery-provider app: maps Supabase rows <->
// the NurseryStore shapes in ./index.ts. Screens keep consuming NurseryStore;
// only this module talks to the backend. All calls assume isSupabaseConfigured.
import { decode } from 'base64-arraybuffer';
import { supabase } from '../lib/supabase';
import {
  NurseryStore, BookingRequest, RosterChild, CapacityGroup, Invoice, Payout,
  MessageThread, Notification,
} from './index';

export type KycDocType = 'license' | 'commercial' | 'owner_id' | 'insurance';

const todayISO = () => new Date().toISOString().slice(0, 10);

function fmtTime(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

// ---- auth -------------------------------------------------------------------
export const auth = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  },
  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, role: 'nursery_owner' } },
    });
    if (error) throw error;
    // When email confirmation is enabled, no session is returned yet.
    return { hasSession: Boolean(data.session), user: data.user };
  },
  async signOut() { await supabase.auth.signOut(); },
  async currentUserId(): Promise<string | null> {
    const { data } = await supabase.auth.getSession();
    return data.session?.user.id ?? null;
  },
};

// ---- nursery (owner's nursery) ---------------------------------------------
async function fetchNursery(ownerId: string) {
  const { data } = await supabase.from('nurseries')
    .select('*').eq('owner_id', ownerId).limit(1).maybeSingle();
  return data;
}

function mapApproval(status: string | undefined): NurseryStore['approvalStatus'] {
  if (status === 'approved') return 'approved';
  if (status === 'rejected') return 'rejected';
  return 'pending';
}

// ---- requests ---------------------------------------------------------------
function expiresInSeconds(iso: string | null): number {
  if (!iso) return 0;
  return Math.max(0, Math.round((new Date(iso).getTime() - Date.now()) / 1000));
}

function mapRequest(r: any): BookingRequest {
  const parentName = r.parent?.full_name ?? 'Parent';
  const childName = r.child?.name ?? 'Child';
  const phone = (r.parent?.phone ?? '').replace(/\D/g, '');
  return {
    id: r.id, parent: parentName,
    child: childName + (r.child?.group_ ? ` · ${r.child.group_}` : ''),
    ageGroup: r.child?.group_ ?? '', type: r.type,
    from: r.schedule ?? r.from_date ?? '', price: Number(r.price), unit: r.unit,
    status: r.status, expiresIn: expiresInSeconds(r.expires_at),
    note: r.note ?? '', phoneLast: phone.slice(-2), paid: true,
  };
}

async function fetchRequests(nurseryId: string): Promise<BookingRequest[]> {
  const { data } = await supabase.from('booking_requests')
    .select('*, parent:profiles!booking_requests_parent_id_fkey(full_name, phone), child:children(name, group_)')
    .eq('nursery_id', nurseryId)
    .order('created_at', { ascending: false });
  return (data ?? []).map(mapRequest);
}

// ---- roster (today's children, from bookings + attendance) ------------------
async function fetchRoster(nurseryId: string): Promise<RosterChild[]> {
  const { data: bookings } = await supabase.from('bookings')
    .select('id, type, child:children(name, group_, parent_id), parent:profiles!bookings_parent_id_fkey(full_name, phone)')
    .eq('nursery_id', nurseryId)
    .in('status', ['confirmed', 'active']);

  const { data: att } = await supabase.from('attendance')
    .select('booking_id, status, in_at:check_in_at, note').eq('nursery_id', nurseryId).eq('date', todayISO());
  const byBooking = new Map<string, any>((att ?? []).map((a: any) => [a.booking_id, a]));

  return (bookings ?? []).map((b: any) => {
    const a = byBooking.get(b.id);
    // DB enum has 'not_in' which the app's union doesn't — treat it as 'out'.
    const raw = a?.status as string | undefined;
    const status: RosterChild['status'] =
      raw && raw !== 'not_in' ? (raw as RosterChild['status']) : 'out';
    return {
      id: b.id, name: b.child?.name ?? 'Child', age: '', group: b.child?.group_ ?? '',
      parent: b.parent?.full_name ?? '', parentPhone: b.parent?.phone ?? '',
      status,
      inAt: fmtTime(a?.in_at ?? null), note: a?.note ?? '', booking: b.type,
    };
  });
}

// ---- capacity / invoices / payouts -----------------------------------------
async function fetchCapacity(nurseryId: string): Promise<CapacityGroup[]> {
  const { data } = await supabase.from('capacity_groups')
    .select('name, group_, total, filled').eq('nursery_id', nurseryId);
  return (data ?? []).map((c: any) => ({
    group: c.name, age: c.group_, total: c.total, filled: c.filled,
  }));
}

async function fetchInvoices(nurseryId: string): Promise<Invoice[]> {
  const { data } = await supabase.from('invoices')
    .select('*, parent:profiles!invoices_parent_id_fkey(full_name)')
    .eq('nursery_id', nurseryId).order('created_at', { ascending: false });
  return (data ?? []).map((i: any) => ({
    id: i.id, parent: i.parent?.full_name ?? '', child: '',
    amount: Number(i.amount), status: i.status,
    date: i.created_at ? new Date(i.created_at).toLocaleDateString('en-GB') : '',
    method: i.method ?? '—',
  }));
}

async function fetchPayouts(nurseryId: string): Promise<Payout[]> {
  const { data } = await supabase.from('payouts')
    .select('*').eq('nursery_id', nurseryId).order('period_end', { ascending: false });
  return (data ?? []).map((p: any) => ({
    id: p.id, period: `${p.period_start} – ${p.period_end}`,
    gross: Number(p.gross), fees: Number(p.fees), net: Number(p.net),
    status: p.status === 'paid' ? 'paid' : 'accruing',
    date: p.paid_at ? new Date(p.paid_at).toLocaleDateString('en-GB') : '—',
  }));
}

// ---- notifications / messaging ---------------------------------------------
async function fetchNotifications(ownerId: string): Promise<Notification[]> {
  const { data } = await supabase.from('notifications')
    .select('*').eq('recipient_id', ownerId).order('created_at', { ascending: false });
  return (data ?? []).map((n: any) => ({
    id: n.id, kind: n.kind, title: n.title, body: n.body ?? '',
    time: n.created_at ? new Date(n.created_at).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }) : '',
    read: n.read, target: n.target ?? null,
  }));
}

async function fetchThreads(nurseryId: string, ownerId: string): Promise<MessageThread[]> {
  const { data: threads } = await supabase.from('message_threads')
    .select('id, last_message, last_at, parent:profiles!message_threads_parent_id_fkey(full_name)')
    .eq('nursery_id', nurseryId).order('last_at', { ascending: false });

  const result: MessageThread[] = [];
  for (const th of threads ?? []) {
    const { data: msgs } = await supabase.from('messages')
      .select('sender_id, body, created_at').eq('thread_id', (th as any).id).order('created_at');
    result.push({
      id: (th as any).id, parent: (th as any).parent?.full_name ?? '', child: '',
      unread: 0, last: (th as any).last_message ?? '', time: fmtTime((th as any).last_at),
      messages: (msgs ?? []).map((m: any) => ({
        me: m.sender_id === ownerId, text: m.body, time: fmtTime(m.created_at),
      })),
    });
  }
  return result;
}

// ---- writes -----------------------------------------------------------------
export async function respondRequest(requestId: string, status: 'accepted' | 'declined') {
  const decision = status === 'accepted' ? 'accept' : 'decline';
  const { error } = await supabase.functions.invoke('respond-request', {
    body: { requestId, decision },
  });
  if (error) throw error;
}

export async function setAttendance(
  nurseryId: string, bookingId: string, childId: string | null,
  status: RosterChild['status'], time?: string,
) {
  // attendance.child_id is NOT NULL — resolve it from the booking when the
  // caller doesn't have it (roster rows are keyed by booking id).
  let cid = childId;
  if (!cid) {
    const { data } = await supabase.from('bookings')
      .select('child_id').eq('id', bookingId).single();
    cid = data?.child_id ?? null;
  }
  if (!cid) throw new Error(`No child found for booking ${bookingId}`);

  const patch: Record<string, unknown> = {
    booking_id: bookingId, child_id: cid, nursery_id: nurseryId,
    date: todayISO(), status,
  };
  if (status === 'in') patch.check_in_at = new Date().toISOString();
  if (status === 'out') patch.check_out_at = new Date().toISOString();
  const { error } = await supabase.from('attendance')
    .upsert(patch, { onConflict: 'booking_id,date' });
  if (error) throw error;
}

export async function setListed(nurseryId: string, listed: boolean) {
  await supabase.from('nurseries').update({ listed }).eq('id', nurseryId);
}

/** Persist profile edits (name/district/phone/tagline) to the server. */
export async function updateNurseryInfo(nurseryId: string, p: {
  name?: string; district?: string; phone?: string; tagline?: string;
}) {
  const patch: Record<string, unknown> = {};
  if (p.name !== undefined) patch.name = p.name;
  if (p.district !== undefined) patch.district = p.district;
  if (p.phone !== undefined) patch.phone = p.phone;
  if (p.tagline !== undefined) patch.tagline = p.tagline;
  if (Object.keys(patch).length) {
    await supabase.from('nurseries').update(patch).eq('id', nurseryId);
  }
}

/** Persist capacity totals per age group (filled is server-derived). */
export async function updateCapacity(nurseryId: string, groups: CapacityGroup[]) {
  for (const g of groups) {
    await supabase.from('capacity_groups')
      .update({ total: g.total, name: g.group })
      .eq('nursery_id', nurseryId).eq('group_', g.age);
  }
}

/** Send a daily report for a booking (locks it as 'sent', parent gets access). */
export async function sendDailyReport(nurseryId: string, bookingId: string, r: {
  mood?: string; meals?: Record<string, string>; napStart?: string; napEnd?: string;
  diapers?: string; activities?: string; note?: string;
}) {
  const { data: b } = await supabase.from('bookings')
    .select('child_id').eq('id', bookingId).single();
  if (!b?.child_id) throw new Error(`No child found for booking ${bookingId}`);
  const { error } = await supabase.from('daily_reports').upsert({
    booking_id: bookingId, child_id: b.child_id, nursery_id: nurseryId,
    date: todayISO(), mood: r.mood ?? null, meals: r.meals ?? {},
    nap_start: r.napStart ?? null, nap_end: r.napEnd ?? null,
    diapers: r.diapers ?? null, activities: r.activities ?? null,
    note: r.note ?? null, status: 'sent', sent_at: new Date().toISOString(),
  }, { onConflict: 'booking_id,date' });
  if (error) throw error;
}

/** Verify a parent's pickup/drop-off code (qr-pass Edge Function). */
export async function verifyPickup(code: string) {
  const { data, error } = await supabase.functions.invoke('qr-pass', {
    body: { action: 'verify', code },
  });
  if (error) throw error;
  return data as { ok: boolean; result: 'checked_in' | 'checked_out'; child: string; parent: string };
}

export async function sendMessage(ownerId: string, threadId: string, text: string) {
  await supabase.from('messages').insert({ thread_id: threadId, sender_id: ownerId, body: text });
  await supabase.from('message_threads')
    .update({ last_message: text, last_at: new Date().toISOString() }).eq('id', threadId);
}

export async function markNotificationsRead(ownerId: string) {
  await supabase.from('notifications').update({ read: true })
    .eq('recipient_id', ownerId).eq('read', false);
}

/**
 * Upload one KYC document (a photo, as base64 from the image picker) to the
 * private `kyc` bucket and record it in nursery_documents. Path is
 * `<nursery_id>/<type>.<ext>` so the storage RLS authorizes it by ownership.
 * Re-uploading a type replaces the previous one.
 */
export async function uploadKycDocument(
  nurseryId: string,
  type: KycDocType,
  file: { base64: string; mimeType?: string },
): Promise<string> {
  const ext = file.mimeType?.includes('png') ? 'png' : 'jpg';
  const path = `${nurseryId}/${type}.${ext}`;

  const { error: upErr } = await supabase.storage.from('kyc')
    .upload(path, decode(file.base64), {
      contentType: file.mimeType || 'image/jpeg', upsert: true,
    });
  if (upErr) throw upErr;

  await supabase.from('nursery_documents').delete()
    .eq('nursery_id', nurseryId).eq('type', type);
  const { error: insErr } = await supabase.from('nursery_documents')
    .insert({ nursery_id: nurseryId, type, file_path: path, status: 'pending' });
  if (insErr) throw insErr;

  return path;
}

export async function submitKyc(nurseryId: string) {
  const { error } = await supabase.functions.invoke('submit-kyc', { body: { nurseryId } });
  if (error) throw error;
}

/** Create the owner's nursery row (status=draft) from the registration form. */
export async function createNursery(form: {
  businessName?: string; owner?: string; district?: string; phone?: string;
}): Promise<string | null> {
  const { data: sess } = await supabase.auth.getSession();
  const ownerId = sess.session?.user.id;
  if (!ownerId) return null;
  const { data, error } = await supabase.from('nurseries').insert({
    owner_id: ownerId,
    name: form.businessName || form.owner || 'My Nursery',
    district: form.district || null,
    phone: form.phone || null,
    status: 'draft', listed: false,
  }).select('id').single();
  if (error) throw error;
  return data.id;
}

// ---- full hydration ---------------------------------------------------------
export async function hydrateStore(ownerId: string): Promise<Partial<NurseryStore>> {
  const nursery = await fetchNursery(ownerId);
  if (!nursery) {
    // Owner has no nursery row yet (mid-registration) — only profile-level data.
    const notifications = await fetchNotifications(ownerId);
    return { notifications, approvalStatus: 'pending' };
  }

  const [requests, roster, capacity, invoices, payouts, notifications, threads] = await Promise.all([
    fetchRequests(nursery.id), fetchRoster(nursery.id), fetchCapacity(nursery.id),
    fetchInvoices(nursery.id), fetchPayouts(nursery.id), fetchNotifications(ownerId),
    fetchThreads(nursery.id, ownerId),
  ]);

  return {
    nursery: {
      id: nursery.id, name: nursery.name, district: nursery.district ?? '',
      phone: nursery.phone ?? '', verified: nursery.verified, listed: nursery.listed,
      rating: Number(nursery.rating), reviews: nursery.reviews_count,
    },
    requests, roster, capacity, invoices, payouts, notifications, threads,
    approvalStatus: mapApproval(nursery.status),
  };
}

/** The owner's nursery id (used by write actions). */
export async function fetchNurseryId(ownerId: string): Promise<string | null> {
  const n = await fetchNursery(ownerId);
  return n?.id ?? null;
}

/**
 * Subscribe to live changes relevant to this nursery (incoming requests, the
 * attendance roster, chat, and notifications). `onChange` fires on any change;
 * the caller debounces and re-hydrates. Returns an unsubscribe function.
 * RLS still applies, so only rows this user may read are delivered.
 */
export function subscribeRealtime(
  nurseryId: string | null,
  ownerId: string,
  onChange: () => void,
): () => void {
  const ch = supabase.channel(`nursery-rt-${ownerId}`);
  if (nurseryId) {
    ch.on('postgres_changes', { event: '*', schema: 'public', table: 'booking_requests', filter: `nursery_id=eq.${nurseryId}` }, onChange);
    ch.on('postgres_changes', { event: '*', schema: 'public', table: 'attendance', filter: `nursery_id=eq.${nurseryId}` }, onChange);
  }
  ch.on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `recipient_id=eq.${ownerId}` }, onChange);
  ch.on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, onChange);
  ch.subscribe();
  return () => { supabase.removeChannel(ch); };
}
