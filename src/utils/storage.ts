import { Platform } from 'react-native';

// Cross-platform storage: localStorage on web, AsyncStorage on native
let AsyncStorage: any = null;

async function getNativeStorage() {
  if (!AsyncStorage) {
    AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
  }
  return AsyncStorage;
}

export async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  const storage = await getNativeStorage();
  return storage.getItem(key);
}

export async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }
  const storage = await getNativeStorage();
  return storage.setItem(key, value);
}

export async function removeItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
    return;
  }
  const storage = await getNativeStorage();
  return storage.removeItem(key);
}
