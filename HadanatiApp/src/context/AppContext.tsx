import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { Animated, Text, View, Platform, ToastAndroid } from 'react-native';
import { AppStore, seedStore, Booking, Child } from '../data';
import { loadStore, saveStore, loadLang, saveLang, clearStore } from '../data/storage';
import { setLangFonts } from '../theme';
import { Lang } from '../i18n';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import * as api from '../data/api';

type Actions = {
  patch: (p: Partial<AppStore>) => void;
  setDraft: (d: Record<string, any>) => void;
  toggleFav: (id: string) => void;
  addChild: (ch: Omit<Child, 'id'>) => void;
  updateChildPhoto: (id: string, uri: string) => void;
  confirmBooking: () => void;
  readNotifs: () => void;
  sendMessage: (threadId: string, text: string) => void;
  setLang: (lang: Lang) => void;
  updateUser: (u: Partial<AppStore['user']>) => void;
  showToast: (msg: string) => void;
  clearData: () => void;
  auth: {
    sendOtp: (phone: string) => Promise<void>;
    verifyOtp: (phone: string, token: string) => Promise<void>;
    signOut: () => Promise<void>;
  };
};

type AppCtx = {
  store: AppStore;
  setStore: React.Dispatch<React.SetStateAction<AppStore>>;
  lang: Lang;
  actions: Actions;
};

const Ctx = createContext<AppCtx | null>(null);

function ToastOverlay({ toastRef }: { toastRef: React.MutableRefObject<((m: string) => void) | null> }) {
  const [msg, setMsg] = useState('');
  const opacity = useRef(new Animated.Value(0)).current;
  const visible = useRef(false);

  const show = useCallback((m: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(m, ToastAndroid.SHORT);
      return;
    }
    setMsg(m);
    if (visible.current) {
      opacity.stopAnimation();
    }
    visible.current = true;
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => { visible.current = false; });
  }, [opacity]);

  toastRef.current = show;

  if (Platform.OS === 'android') return null;

  return (
    <Animated.View pointerEvents="none" style={{
      position: 'absolute', bottom: 100, left: 30, right: 30, zIndex: 9999,
      opacity, alignItems: 'center',
    }}>
      <View style={{ backgroundColor: 'rgba(28,43,30,0.92)', borderRadius: 22, paddingVertical: 11, paddingHorizontal: 22 }}>
        <Text style={{ color: '#fff', fontSize: 13.5, fontWeight: '600', textAlign: 'center' }}>{msg}</Text>
      </View>
    </Animated.View>
  );
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<AppStore>(seedStore);
  const [lang, setLangState] = useState<Lang>('en');
  const [hydrated, setHydrated] = useState(false);
  const toastRef = useRef<((m: string) => void) | null>(null);
  const userIdRef = useRef<string | null>(null);
  const remote = isSupabaseConfigured;
  const w = (e: unknown) => console.warn('[sync]', e);

  const hydrateFromServer = useCallback(async (uid: string) => {
    try {
      const partial = await api.hydrateStore(uid);
      setStore(s => {
        // Server arrays are authoritative. For the user profile, keep any
        // locally-entered non-empty field when the server value is still blank
        // (e.g. right after sign-up, before the profile row is filled).
        const user = { ...s.user };
        if (partial.user) {
          for (const [k, v] of Object.entries(partial.user)) {
            if (v) (user as Record<string, unknown>)[k] = v;
          }
        }
        return { ...s, ...partial, user };
      });
    } catch (e) { w(e); }
  }, []);

  // Select the font family for the active language during render, so the whole
  // tree (which reads F.* in inline styles) paints with Cairo for Arabic.
  setLangFonts(lang);

  // Load saved data from the device on first mount.
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

  // Persist changes — but only after hydration, so we never overwrite saved
  // data with the initial seed before it has loaded.
  useEffect(() => {
    if (hydrated) saveStore(store);
  }, [store, hydrated]);

  useEffect(() => {
    if (hydrated) saveLang(lang);
  }, [lang, hydrated]);

  // When a backend is configured, track the auth session and hydrate the store
  // from the server on sign-in. Local cache above still gives an instant paint.
  useEffect(() => {
    if (!remote) return;
    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user.id ?? null;
      userIdRef.current = uid;
      if (uid) hydrateFromServer(uid);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const uid = session?.user.id ?? null;
      userIdRef.current = uid;
      if (uid) hydrateFromServer(uid);
    });
    return () => sub.subscription.unsubscribe();
  }, [remote, hydrateFromServer]);

  // Each mutating action updates local state immediately (snappy UI + offline
  // cache) and, when a backend is configured and the user is signed in, mirrors
  // the change to Supabase. Remote calls are fire-and-forget with a warn on
  // failure, so a transient network error never blocks the UI.
  const uid = () => userIdRef.current;

  const actions: Actions = {
    patch: (p) => setStore(s => ({ ...s, ...p })),
    setDraft: (d) => setStore(s => ({ ...s, draft: { ...s.draft, ...d } })),
    toggleFav: (id) => {
      const willOn = !store.favorites.includes(id);
      setStore(s => ({ ...s, favorites: s.favorites.includes(id) ? s.favorites.filter(x => x !== id) : [...s.favorites, id] }));
      if (remote && uid()) api.setFavorite(uid()!, id, willOn).catch(w);
    },
    addChild: (ch) => {
      if (remote && uid()) {
        api.addChild(uid()!, ch)
          .then(child => setStore(s => ({ ...s, children: [...s.children, child] })))
          .catch(w);
      } else {
        setStore(s => ({ ...s, children: [...s.children, { ...ch, id: 'c' + (s.children.length + 1) }] }));
      }
    },
    updateChildPhoto: (id, uri) => {
      setStore(s => ({ ...s, children: s.children.map(c => c.id === id ? { ...c, photoUri: uri } : c) }));
      if (remote && uid()) api.updateChildPhoto(id, uri).catch(w);
    },
    confirmBooking: () => {
      const d = store.draft;
      setStore(s => {
        const dr = s.draft;
        const id = 'b' + (s.bookings.length + 1);
        const childIds: string[] = dr.childIds || (dr.childId ? [dr.childId] : []);
        const nb: Booking = { id, nurseryId: dr.nurseryId, childId: dr.childId, childIds, type: dr.type, status: 'confirmed', dates: dr.dates || 'Upcoming', price: dr.price, unit: dr.unit };
        return { ...s, bookings: [nb, ...s.bookings], draft: { ...s.draft, bookingId: id } };
      });
      if (remote && uid() && d?.nurseryId && d?.childId) {
        api.createBookingRequest({
          nurseryId: d.nurseryId, childId: d.childId, type: d.type,
          ageGroup: d.ageGroup, schedule: d.dates, fromDate: d.fromDate, method: d.method,
        }).then(() => { const u = uid(); if (u) hydrateFromServer(u); }).catch(w);
      }
    },
    readNotifs: () => {
      setStore(s => ({ ...s, notifications: s.notifications.map(n => ({ ...n, read: true })) }));
      if (remote && uid()) api.markNotificationsRead(uid()!).catch(w);
    },
    sendMessage: (threadId, text) => {
      setStore(s => ({ ...s, threads: s.threads.map(t => t.id === threadId ? { ...t, last: text, unread: 0, messages: [...t.messages, { me: true, text, time: 'now' }] } : t) }));
      if (remote && uid()) api.sendMessage(uid()!, threadId, text).catch(w);
    },
    setLang: (l) => setLangState(l),
    updateUser: (u) => {
      setStore(s => ({ ...s, user: { ...s.user, ...u } }));
      if (remote && uid()) api.upsertProfile(uid()!, u).catch(w);
    },
    showToast: (msg) => toastRef.current?.(msg),
    clearData: () => {
      clearStore(); setStore(seedStore()); setLangState('en');
      if (remote) api.auth.signOut().catch(w);
    },
    auth: {
      sendOtp: (phone) => api.auth.sendOtp(phone),
      verifyOtp: async (phone, token) => { await api.auth.verifyOtp(phone, token); },
      signOut: () => api.auth.signOut(),
    },
  };

  return (
    <Ctx.Provider value={{ store, setStore, lang, actions }}>
      {children}
      <ToastOverlay toastRef={toastRef} />
    </Ctx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp outside provider');
  return ctx;
}
