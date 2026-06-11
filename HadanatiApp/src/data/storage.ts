import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppStore } from './index';
import { Lang } from '../i18n';

const STORE_KEY = 'hadanati.store.v1';
const LANG_KEY = 'hadanati.lang.v1';

// The transient booking-flow draft is intentionally NOT persisted.
type PersistedStore = Omit<AppStore, 'draft'>;

/** Load the saved store from the device. Returns null on first launch or error. */
export async function loadStore(): Promise<PersistedStore | null> {
  try {
    const raw = await AsyncStorage.getItem(STORE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedStore;
  } catch (e) {
    console.warn('[storage] loadStore failed', e);
    return null;
  }
}

/** Persist the store (minus the transient draft). Fire-and-forget. */
export async function saveStore(store: AppStore): Promise<void> {
  try {
    const { draft, ...rest } = store;
    await AsyncStorage.setItem(STORE_KEY, JSON.stringify(rest));
  } catch (e) {
    console.warn('[storage] saveStore failed', e);
  }
}

export async function loadLang(): Promise<Lang | null> {
  try {
    const raw = await AsyncStorage.getItem(LANG_KEY);
    return raw === 'ar' || raw === 'en' ? raw : null;
  } catch {
    return null;
  }
}

export async function saveLang(lang: Lang): Promise<void> {
  try {
    await AsyncStorage.setItem(LANG_KEY, lang);
  } catch (e) {
    console.warn('[storage] saveLang failed', e);
  }
}

/** Wipe all persisted data (used by "Delete account"). */
export async function clearStore(): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.removeItem(STORE_KEY),
      AsyncStorage.removeItem(LANG_KEY),
    ]);
  } catch (e) {
    console.warn('[storage] clearStore failed', e);
  }
}
