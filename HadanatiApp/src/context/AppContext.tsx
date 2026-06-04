import React, { createContext, useContext, useState } from 'react';
import { AppStore, seedStore, Booking, Child } from '../data';
import { Lang } from '../i18n';

type Actions = {
  patch: (p: Partial<AppStore>) => void;
  setDraft: (d: Record<string, any>) => void;
  toggleFav: (id: string) => void;
  addChild: (ch: Omit<Child, 'id'>) => void;
  confirmBooking: () => void;
  readNotifs: () => void;
  sendMessage: (threadId: string, text: string) => void;
  setLang: (lang: Lang) => void;
};

type AppCtx = {
  store: AppStore;
  setStore: React.Dispatch<React.SetStateAction<AppStore>>;
  lang: Lang;
  actions: Actions;
};

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<AppStore>(seedStore);
  const [lang, setLangState] = useState<Lang>('en');

  const actions: Actions = {
    patch: (p) => setStore(s => ({ ...s, ...p })),
    setDraft: (d) => setStore(s => ({ ...s, draft: { ...s.draft, ...d } })),
    toggleFav: (id) => setStore(s => ({ ...s, favorites: s.favorites.includes(id) ? s.favorites.filter(x => x !== id) : [...s.favorites, id] })),
    addChild: (ch) => setStore(s => ({ ...s, children: [...s.children, { ...ch, id: 'c' + (s.children.length + 1) }] })),
    confirmBooking: () => setStore(s => {
      const d = s.draft;
      const id = 'b' + (s.bookings.length + 1);
      const nb: Booking = { id, nurseryId: d.nurseryId, childId: d.childId, type: d.type, status: 'confirmed', dates: d.dates || 'Upcoming', price: d.price, unit: d.unit };
      return { ...s, bookings: [nb, ...s.bookings], draft: { ...s.draft, bookingId: id } };
    }),
    readNotifs: () => setStore(s => ({ ...s, notifications: s.notifications.map(n => ({ ...n, read: true })) })),
    sendMessage: (threadId, text) => setStore(s => ({ ...s, threads: s.threads.map(t => t.id === threadId ? { ...t, last: text, unread: 0, messages: [...t.messages, { me: true, text, time: 'now' }] } : t) })),
    setLang: (l) => setLangState(l),
  };

  return <Ctx.Provider value={{ store, setStore, lang, actions }}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp outside provider');
  return ctx;
}
