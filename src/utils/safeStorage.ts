import { Platform } from 'react-native';

const memoryStore = new Map<string, string>();

function getAsyncStorage() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('@react-native-async-storage/async-storage');
    return mod?.default ?? mod;
  } catch {
    return null;
  }
}

function getFileSystem() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('expo-file-system');
    return fs?.documentDirectory ? fs : null;
  } catch {
    return null;
  }
}

function getFilePath(key: string): string | null {
  const fs = getFileSystem();
  if (!fs || !fs.documentDirectory) return null;
  const safeName = encodeURIComponent(key).replace(/%/g, '_');
  return `${fs.documentDirectory}naga_storage_${safeName}.json`;
}

/**
 * Universal safe storage adapter that handles Expo Go, Web, and Native environments.
 * Uses a resilient multi-tier strategy:
 * 1. Web localStorage (when running on web)
 * 2. React Native AsyncStorage (with safe ESM/CJS interop fallback)
 * 3. Durable FileSystem storage (backup persistent layer for native)
 * 4. In-memory Map (safety fallback)
 */
export const safeStorage = {
  async getItem(key: string): Promise<string | null> {
    // 1. Web LocalStorage
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const webVal = window.localStorage.getItem(key);
          if (webVal !== null && webVal !== undefined) return webVal;
        }
      } catch {
        // Fall back to next storage tier
      }
    }

    // 2. React Native AsyncStorage
    try {
      const AsyncStorage = getAsyncStorage();
      if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
        const val = await AsyncStorage.getItem(key);
        if (val !== null && val !== undefined) return val;
      }
    } catch {
      // Native module error or unlinked; fall through to FileSystem
    }

    // 3. Native FileSystem Fallback
    try {
      const fs = getFileSystem();
      const filePath = getFilePath(key);
      if (fs && filePath) {
        const fileInfo = await fs.getInfoAsync(filePath);
        if (fileInfo?.exists) {
          const content = await fs.readAsStringAsync(filePath);
          if (content !== null && content !== undefined) return content;
        }
      }
    } catch {
      // File system not accessible; fall through to memoryStore
    }

    // 4. Memory store
    return memoryStore.get(key) ?? null;
  },

  async setItem(key: string, value: string): Promise<void> {
    memoryStore.set(key, value);

    // 1. Web LocalStorage
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
          return;
        }
      } catch {
        // Fall back
      }
    }

    let persisted = false;

    // 2. React Native AsyncStorage
    try {
      const AsyncStorage = getAsyncStorage();
      if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
        await AsyncStorage.setItem(key, value);
        persisted = true;
      }
    } catch {
      // Fall through to file system
    }

    // 3. Native FileSystem Fallback (always write as backup if available or if AsyncStorage failed)
    try {
      const fs = getFileSystem();
      const filePath = getFilePath(key);
      if (fs && filePath && (!persisted || Platform.OS !== 'web')) {
        await fs.writeAsStringAsync(filePath, value);
      }
    } catch {
      // Ignore if file system fails
    }
  },

  async removeItem(key: string): Promise<void> {
    memoryStore.delete(key);

    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
          return;
        }
      } catch {}
    }

    try {
      const AsyncStorage = getAsyncStorage();
      if (AsyncStorage && typeof AsyncStorage.removeItem === 'function') {
        await AsyncStorage.removeItem(key);
      }
    } catch {}

    try {
      const fs = getFileSystem();
      const filePath = getFilePath(key);
      if (fs && filePath) {
        const fileInfo = await fs.getInfoAsync(filePath);
        if (fileInfo?.exists) {
          await fs.deleteAsync(filePath, { idempotent: true });
        }
      }
    } catch {}
  },
};
