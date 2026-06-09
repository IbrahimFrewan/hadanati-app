import React, { createContext, useContext, useState } from 'react';
import { seedNursery, NurseryStore } from '../data';

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
  };
}

const NurseryContext = createContext<NurseryContextType | null>(null);

export function NurseryProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<NurseryStore>(seedNursery);
  const [lang, setLang] = useState('EN');

  const actions: NurseryContextType['actions'] = {
    patch: (p) => setStore((s) => ({ ...s, ...p })),
    setReg: (p) => setStore((s) => ({ ...s, registration: { ...s.registration, ...p } })),
    setApproval: (st) => setStore((s) => ({ ...s, approvalStatus: st })),
    respondRequest: (id, status) =>
      setStore((s) => ({ ...s, requests: s.requests.map((r) => r.id === id ? { ...r, status } : r) })),
    checkIn: (id, time) =>
      setStore((s) => ({ ...s, roster: s.roster.map((k) => k.id === id ? { ...k, status: 'in' as const, inAt: time } : k) })),
    checkOut: (id) =>
      setStore((s) => ({ ...s, roster: s.roster.map((k) => k.id === id ? { ...k, status: 'out' as const } : k) })),
    markAbsent: (id) =>
      setStore((s) => ({ ...s, roster: s.roster.map((k) => k.id === id ? { ...k, status: 'absent' as const } : k) })),
    readNotifs: () =>
      setStore((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
    sendMessage: (threadId, text) =>
      setStore((s) => ({
        ...s,
        threads: s.threads.map((t) =>
          t.id === threadId
            ? { ...t, last: text, unread: 0, messages: [...t.messages, { me: true, text, time: 'now' }] }
            : t
        ),
      })),
    setListed: (b) => setStore((s) => ({ ...s, nursery: { ...s.nursery, listed: b } })),
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
