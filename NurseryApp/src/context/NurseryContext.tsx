import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { seedNursery, NurseryStore } from '../data';
import { loadStore, saveStore, loadLang, saveLang } from '../data/storage';
import { setLangFonts } from '../theme';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import * as api from '../data/api';

interface NurseryContextType {
  store: NurseryStore;
  lang: string;
  setLang: (l: string) => void;
  actions: {
    patch: (p: Partial<NurseryStore>) => void;
    setReg: (p: Partial<NurseryStore['registration']>) => void;
    setApproval: (st: NurseryStore['approvalStatus']) => void;
    respondRequest: (id: string, status: 'accepted' | 'declined') => void;
    checkIn: (id: string, time: string) => void;
    checkOut: (id: string) => void;
    markAbsent: (id: string) => void;
    readNotifs: () => void;
    sendMessage: (threadId: string, text: string) => void;
    setListed: (b: boolean) => void;
    uploadKyc: (type: api.KycDocType, file: { base64: string; mimeType?: string }) => Promise<void>;
    submitKyc: () => Promise<void>;
    auth: {
      signIn: (email: string, password: string) => Promise<void>;
      signUp: (email: string, password: string, fullName: string) => Promise<{ hasSession: boolean }>;
      signOut: () => Promise<void>;
    };
  };
}

const NurseryContext = createContext<NurseryContextType | null>(null);

export function NurseryProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<NurseryStore>(seedNursery);
  const [lang, setLangState] = useState('EN');
  const [hydrated, setHydrated] = useState(false);
  const ownerIdRef = useRef<string | null>(null);
  const nurseryIdRef = useRef<string | null>(null);
  const remote = isSupabaseConfigured;
  const w = (e: unknown) => console.warn('[sync]', e);

  setLangFonts(lang);

  const hydrateFromServer = useCallback(async (ownerId: string) => {
    try {
      const partial = await api.hydrateStore(ownerId);
      nurseryIdRef.current = partial.nursery?.id ?? await api.fetchNurseryId(ownerId);
      setStore(s => ({ ...s, ...partial }));
    } catch (e) { w(e); }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const [saved, savedLang] = await Promise.all([loadStore(), loadLang()]);
      if (!active) return;
      if (saved) setStore(s => ({ ...s, ...saved }));
      if (savedLang) setLangState(savedLang);
      setHydrated(true);
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (hydrated) saveStore(store);
  }, [store, hydrated]);

  useEffect(() => {
    if (hydrated) saveLang(lang);
  }, [lang, hydrated]);

  // Track the auth session and hydrate the store from the server on sign-in.
  useEffect(() => {
    if (!remote) return;
    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user.id ?? null;
      ownerIdRef.current = uid;
      if (uid) hydrateFromServer(uid);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const uid = session?.user.id ?? null;
      ownerIdRef.current = uid;
      if (uid) hydrateFromServer(uid);
    });
    return () => sub.subscription.unsubscribe();
  }, [remote, hydrateFromServer]);

  const setLang = (l: string) => setLangState(l);

  // Each mutating action updates local state immediately, and — when a backend
  // is configured and the owner is signed in — mirrors the change to Supabase.
  // Remote calls are fire-and-forget with a warn on failure.
  const oid = () => ownerIdRef.current;
  const nid = () => nurseryIdRef.current;

  // Resolve the owner's nursery id, fetching it if the store hasn't hydrated yet
  // (e.g. immediately after registration, when navigating into KYC).
  const ensureNurseryId = async (): Promise<string | null> => {
    if (nurseryIdRef.current) return nurseryIdRef.current;
    const o = oid();
    if (!o) return null;
    const id = await api.fetchNurseryId(o);
    nurseryIdRef.current = id;
    return id;
  };

  const actions: NurseryContextType['actions'] = {
    patch: (p) => setStore((s) => ({ ...s, ...p })),
    setReg: (p) => setStore((s) => ({ ...s, registration: { ...s.registration, ...p } })),
    setApproval: (st) => setStore((s) => ({ ...s, approvalStatus: st })),
    respondRequest: (id, status) => {
      setStore((s) => ({ ...s, requests: s.requests.map((r) => r.id === id ? { ...r, status } : r) }));
      if (remote && oid()) {
        api.respondRequest(id, status).then(() => { const o = oid(); if (o) hydrateFromServer(o); }).catch(w);
      }
    },
    checkIn: (id, time) => {
      setStore((s) => ({ ...s, roster: s.roster.map((k) => k.id === id ? { ...k, status: 'in' as const, inAt: time } : k) }));
      if (remote && nid()) api.setAttendance(nid()!, id, null, 'in').catch(w);
    },
    checkOut: (id) => {
      setStore((s) => ({ ...s, roster: s.roster.map((k) => k.id === id ? { ...k, status: 'out' as const } : k) }));
      if (remote && nid()) api.setAttendance(nid()!, id, null, 'out').catch(w);
    },
    markAbsent: (id) => {
      setStore((s) => ({ ...s, roster: s.roster.map((k) => k.id === id ? { ...k, status: 'absent' as const } : k) }));
      if (remote && nid()) api.setAttendance(nid()!, id, null, 'absent').catch(w);
    },
    readNotifs: () => {
      setStore((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
      if (remote && oid()) api.markNotificationsRead(oid()!).catch(w);
    },
    sendMessage: (threadId, text) => {
      setStore((s) => ({
        ...s,
        threads: s.threads.map((t) =>
          t.id === threadId
            ? { ...t, last: text, unread: 0, messages: [...t.messages, { me: true, text, time: 'now' }] }
            : t
        ),
      }));
      if (remote && oid()) api.sendMessage(oid()!, threadId, text).catch(w);
    },
    setListed: (b) => {
      setStore((s) => ({ ...s, nursery: { ...s.nursery, listed: b } }));
      if (remote && nid()) api.setListed(nid()!, b).catch(w);
    },
    uploadKyc: async (type, file) => {
      if (!remote) return;
      const id = await ensureNurseryId();
      if (!id) throw new Error('No nursery found for this account.');
      await api.uploadKycDocument(id, type, file);
    },
    submitKyc: async () => {
      if (!remote) return;
      const id = await ensureNurseryId();
      if (!id) throw new Error('No nursery found for this account.');
      await api.submitKyc(id);
      setStore((s) => ({ ...s, approvalStatus: 'pending' }));
      const o = oid();
      if (o) hydrateFromServer(o);
    },
    auth: {
      signIn: async (email, password) => { await api.auth.signIn(email, password); },
      signUp: (email, password, fullName) => api.auth.signUp(email, password, fullName),
      signOut: async () => {
        await api.auth.signOut();
        ownerIdRef.current = null; nurseryIdRef.current = null;
      },
    },
  };

  return (
    <NurseryContext.Provider value={{ store, lang, setLang, actions }}>
      {children}
    </NurseryContext.Provider>
  );

}

export function useN() {
  const ctx = useContext(NurseryContext);
  if (!ctx) throw new Error('useN must be used within NurseryProvider');
  return ctx;
}
