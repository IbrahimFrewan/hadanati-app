import AsyncStorage from '@react-native-async-storage/async-storage';
import { NurseryStore } from './index';

const STORE_KEY = 'nursery.store.v1';
const LANG_KEY = 'nursery.lang.v1';

type PersistedStore = Omit<NurseryStore, 'draft'>;

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

export async function saveStore(store: NurseryStore): Promise<void> {
  try {
    const { draft, ...rest } = store;
    await AsyncStorage.setItem(STORE_KEY, JSON.stringify(rest));
  } catch (e) {
    console.warn('[storage] saveStore failed', e);
  }
}

export async function loadLang(): Promise<string | null> {
  try {
    const raw = await AsyncStorage.getItem(LANG_KEY);
    return raw === 'AR' || raw === 'EN' ? raw : null;
  } catch {
    return null;
  }
}

export async function saveLang(lang: string): Promise<void> {
  try {
    await AsyncStorage.setItem(LANG_KEY, lang);
  } catch (e) {
    console.warn('[storage] saveLang failed', e);
  }
}

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
