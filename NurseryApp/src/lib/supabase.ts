import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Read from Expo public env (inlined at build time). Copy .env.example to .env
// and fill from your Supabase project (Settings → API).
const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

/**
 * Whether a real backend is configured. When false the app runs entirely on
 * its local seed/store (current behaviour) — no network calls are attempted.
 * This makes the Supabase integration strictly additive / regression-safe.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = createClient(url, anonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
