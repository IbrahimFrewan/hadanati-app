// Typed data-access layer: maps Supabase rows <-> the app's existing types
// (see ./index.ts). Every screen keeps consuming the same AppStore shape; only
// this module talks to the backend. All calls assume `isSupabaseConfigured`.
import { supabase } from '../lib/supabase';
import { AppStore, Booking, Child, Notification, Thread, Nursery, DEFAULT_NURSERY_IMG } from './index';

const E164 = (digits: string) => `+962${digits.replace(/\D/g, '')}`;

function fmtTime(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' });
}

// ---- auth -------------------------------------------------------------------
export const auth = {
  // shouldCreate=false for login (reject unregistered numbers); true for sign-up.
  async sendOtp(phoneDigits: string, shouldCreate = true) {
    const { error } = await supabase.auth.signInWithOtp({
      phone: E164(phoneDigits),
      options: { shouldCreateUser: shouldCreate },
    });
    if (error) throw error;
  },
  async verifyOtp(phoneDigits: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: E164(phoneDigits), token, type: 'sms',
    });
    if (error) throw error;
    return data.user;
  },
  async signOut() {
    await supabase.auth.signOut();
  },
  async currentUserId(): Promise<string | null> {
    const { data } = await supabase.auth.getSession();
    return data.session?.user.id ?? null;
  },
};

// ---- profile ----------------------------------------------------------------
export async function fetchProfile(userId: string): Promise<AppStore['user']> {
  const { data } = await supabase
    .from('profiles').select('full_name, phone, email, avatar_url')
    .eq('id', userId).single();
  return {
    name: data?.full_name ?? '',
    phone: (data?.phone ?? '').replace(/^\+962/, ''),
    email: data?.email ?? '',
    photoUri: data?.avatar_url ?? '',
  };
}

export async function upsertProfile(userId: string, u: Partial<AppStore['user']>) {
  const patch: Record<string, unknown> = { id: userId };
  if (u.name !== undefined) patch.full_name = u.name;
  if (u.phone !== undefined) patch.phone = u.phone ? E164(u.phone) : null;
  if (u.email !== undefined) patch.email = u.email;
  if (u.photoUri !== undefined) patch.avatar_url = u.photoUri;
  const { error } = await supabase.from('profiles').upsert(patch);
  if (error) throw error;
}

// ---- children ---------------------------------------------------------------
function mapChild(r: any): Child {
  return {
    id: r.id, name: r.name, dob: r.dob ?? '', ageGroup: r.group_ ?? '',
    allergies: r.allergies ?? '', photoUri: r.photo_url ?? '',
  };
}

export async function fetchChildren(userId: string): Promise<Child[]> {
  const { data } = await supabase.from('children')
    .select('*').eq('parent_id', userId).order('created_at');
  return (data ?? []).map(mapChild);
}

export async function addChild(userId: string, ch: Omit<Child, 'id'>): Promise<Child> {
  const { data, error } = await supabase.from('children').insert({
    parent_id: userId, name: ch.name, dob: ch.dob || null,
    group_: ch.ageGroup || null, allergies: ch.allergies ?? '', photo_url: ch.photoUri || null,
  }).select('*').single();
  if (error) throw error;
  return mapChild(data);
}

export async function updateChildPhoto(childId: string, uri: string) {
  await supabase.from('children').update({ photo_url: uri }).eq('id', childId);
}

// ---- favorites --------------------------------------------------------------
export async function fetchFavorites(userId: string): Promise<string[]> {
  const { data } = await supabase.from('favorites')
    .select('nursery_id').eq('parent_id', userId);
  return (data ?? []).map((r: any) => r.nursery_id);
}

export async function setFavorite(userId: string, nurseryId: string, on: boolean) {
  if (on) {
    await supabase.from('favorites').upsert({ parent_id: userId, nursery_id: nurseryId });
  } else {
    await supabase.from('favorites').delete()
      .eq('parent_id', userId).eq('nursery_id', nurseryId);
  }
}

// ---- bookings ---------------------------------------------------------------
function mapBooking(r: any): Booking {
  return {
    id: r.id, nurseryId: r.nursery_id, childId: r.child_id,
    type: r.type, status: r.status,
    dates: r.start_date ?? 'Upcoming', price: Number(r.price), unit: r.unit,
  };
}

export async function fetchBookings(userId: string): Promise<Booking[]> {
  const { data } = await supabase.from('bookings')
    .select('*').eq('parent_id', userId).order('created_at', { ascending: false });
  return (data ?? []).map(mapBooking);
}

/** Create booking request(s) (escrow authorize) via the trusted Edge Function.
 *  Server computes the authoritative price: unit × qty, one request per child. */
export async function createBookingRequest(input: {
  nurseryId: string; childIds: string[]; type: string; qty?: number;
  ageGroup?: string; schedule?: string; fromDate?: string; method?: string;
}) {
  const { data, error } = await supabase.functions.invoke('confirm-booking', { body: input });
  if (error) throw error;
  return data as { ok: boolean; requestIds: string[]; perChild: number; total: number; unit: string };
}

/** Cancel a confirmed/active booking (refund handled server-side). */
export async function cancelBooking(bookingId: string) {
  const { data, error } = await supabase.functions.invoke('cancel-booking', { body: { bookingId } });
  if (error) throw error;
  return data as { ok: boolean };
}

/** Get today's one-time pickup/drop-off code for a booking. */
export async function issuePickupCode(bookingId: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke('qr-pass', {
    body: { action: 'issue', bookingId },
  });
  if (error) throw error;
  return (data as any).code as string;
}

// ---- marketplace (approved + listed nurseries) -------------------------------
export async function fetchPublicNurseries(): Promise<Nursery[]> {
  const { data } = await supabase.from('nurseries')
    .select('id, name, district, lat, lng, tagline, rating, reviews_count, verified, sponsored, price_hourly, price_daily, price_weekly, price_monthly, capacity_groups(group_, total, filled), nursery_media(file_path, is_cover, kind)')
    .eq('status', 'approved').eq('listed', true)
    .order('sponsored', { ascending: false }).order('rating', { ascending: false });

  return (data ?? []).map((n: any): Nursery => {
    const caps: any[] = n.capacity_groups ?? [];
    const free = caps.reduce((a, c) => a + Math.max(0, c.total - c.filled), 0);
    const total = caps.reduce((a, c) => a + c.total, 0);
    const cover = (n.nursery_media ?? []).find((m: any) => m.is_cover && m.kind === 'photo')
      ?? (n.nursery_media ?? []).find((m: any) => m.kind === 'photo');
    const img = cover
      ? supabase.storage.from('nursery-media').getPublicUrl(cover.file_path).data.publicUrl
      : DEFAULT_NURSERY_IMG;
    const priceFrom = n.price_monthly ?? n.price_weekly ?? n.price_daily ?? n.price_hourly ?? 0;
    const unit = n.price_monthly != null ? 'mo' : n.price_weekly != null ? 'wk' : n.price_daily != null ? 'day' : 'hr';
    return {
      id: n.id, name: n.name, district: n.district ?? '',
      rating: Number(n.rating) || 0, reviews: n.reviews_count ?? 0,
      priceFrom: Number(priceFrom), unit,
      ages: [...new Set(caps.map((c) => c.group_))] as string[],
      avail: total === 0 ? 'available' : free === 0 ? 'full' : free <= 2 ? 'limited' : 'available',
      verified: !!n.verified, sponsored: !!n.sponsored,
      tag: n.tagline ?? '', img, lat: n.lat ?? 31.95, lng: n.lng ?? 35.91,
    };
  });
}

// ---- daily reports (parent view) ----------------------------------------------
export type ParentReport = {
  id: string; childId: string; nurseryId: string; date: string;
  mood: string; sleep: string; mealsCount: number; media: number; unread: boolean;
};

export async function fetchDailyReports(userId: string): Promise<ParentReport[]> {
  const { data } = await supabase.from('daily_reports')
    .select('id, child_id, nursery_id, date, mood, meals, nap_start, nap_end, status, report_media(id)')
    .eq('status', 'sent')
    .order('date', { ascending: false })
    .limit(60);
  return (data ?? []).map((r: any) => ({
    id: r.id, childId: r.child_id, nurseryId: r.nursery_id,
    date: r.date, mood: r.mood ?? 'happy',
    sleep: r.nap_start && r.nap_end ? `${r.nap_start}–${r.nap_end}` : '—',
    mealsCount: r.meals ? Object.keys(r.meals).length : 0,
    media: (r.report_media ?? []).length, unread: false,
  }));
}

// ---- reviews -------------------------------------------------------------------
/** Submit a review; requires one of the caller's bookings at that nursery. */
export async function submitReview(userId: string, nurseryId: string, rating: number, comment: string) {
  const { data: booking } = await supabase.from('bookings')
    .select('id').eq('parent_id', userId).eq('nursery_id', nurseryId)
    .limit(1).maybeSingle();
  if (!booking) throw new Error('You can review a nursery after booking it.');
  const { error } = await supabase.from('reviews').insert({
    booking_id: booking.id, parent_id: userId, nursery_id: nurseryId, rating, comment,
  });
  if (error) throw error;
}

// ---- notifications ----------------------------------------------------------
function mapNotif(r: any): Notification {
  return {
    id: r.id, kind: r.kind, title: r.title, body: r.body ?? '',
    time: fmtTime(r.created_at), read: r.read, target: r.target ?? null,
  };
}

export async function fetchNotifications(userId: string): Promise<Notification[]> {
  const { data } = await supabase.from('notifications')
    .select('*').eq('recipient_id', userId).order('created_at', { ascending: false });
  return (data ?? []).map(mapNotif);
}

export async function markNotificationsRead(userId: string) {
  await supabase.from('notifications').update({ read: true })
    .eq('recipient_id', userId).eq('read', false);
}

// ---- messaging --------------------------------------------------------------
export async function fetchThreads(userId: string): Promise<Thread[]> {
  const { data: threads } = await supabase.from('message_threads')
    .select('id, nursery_id, last_message, last_at').eq('parent_id', userId)
    .order('last_at', { ascending: false });

  const result: Thread[] = [];
  for (const th of threads ?? []) {
    const { data: msgs } = await supabase.from('messages')
      .select('sender_id, body, created_at').eq('thread_id', th.id)
      .order('created_at');
    result.push({
      id: th.id, nurseryId: th.nursery_id, unread: 0,
      last: th.last_message ?? '', time: fmtTime(th.last_at),
      messages: (msgs ?? []).map((m: any) => ({
        me: m.sender_id === userId, text: m.body, time: fmtTime(m.created_at),
      })),
    });
  }
  return result;
}

export async function sendMessage(userId: string, threadId: string, text: string) {
  await supabase.from('messages').insert({ thread_id: threadId, sender_id: userId, body: text });
  await supabase.from('message_threads')
    .update({ last_message: text, last_at: new Date().toISOString() }).eq('id', threadId);
}

// ---- realtime ---------------------------------------------------------------
/**
 * Subscribe to live changes relevant to this parent (booking status updates,
 * chat, notifications). `onChange` fires on any change; the caller debounces and
 * re-hydrates. Returns an unsubscribe function. RLS still applies.
 */
export function subscribeRealtime(userId: string, onChange: () => void): () => void {
  const ch = supabase.channel(`parent-rt-${userId}`);
  ch.on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `recipient_id=eq.${userId}` }, onChange);
  ch.on('postgres_changes', { event: '*', schema: 'public', table: 'bookings', filter: `parent_id=eq.${userId}` }, onChange);
  ch.on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, onChange);
  ch.subscribe();
  return () => { supabase.removeChannel(ch); };
}

// ---- full hydration ---------------------------------------------------------
export async function hydrateStore(userId: string): Promise<Partial<AppStore>> {
  const [user, children, favorites, bookings, notifications, threads] = await Promise.all([
    fetchProfile(userId), fetchChildren(userId), fetchFavorites(userId),
    fetchBookings(userId), fetchNotifications(userId), fetchThreads(userId),
  ]);
  return { user, children, favorites, bookings, notifications, threads };
}
