import Logger from './Logger';

export enum SessionStorageKey {
  AUTH_REVOKED = 'authRevoked',
}

export default class StorageUtils {
  public static set(key: SessionStorageKey, data: string) {
    sessionStorage.setItem(key, data);
  }

  public static get(key: SessionStorageKey) {
    return sessionStorage.getItem(key);
  }

  public static getParsed<T>(key: SessionStorageKey, defaultValue: T) {
    try {
      const item = sessionStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      Logger.danger(`Error while parsing Stored data - key: ${key}`);
      return defaultValue;
    }
  }

  public static setRaw<T>(key: SessionStorageKey, data: T) {
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      Logger.danger(`Error while serializing data for storage - key: ${key}`);
    }
  }

  public static remove(key: SessionStorageKey) {
    sessionStorage.removeItem(key);
  }

  public static clear(keys?: SessionStorageKey[]) {
    if (!keys) {
      sessionStorage.clear();
      return;
    }
    keys.forEach((k) => sessionStorage.removeItem(k));
  }

  public static clearAll(options?: { exceptions?: SessionStorageKey[] }) {
    Object.values(SessionStorageKey).forEach((key) => {
      if (!options?.exceptions?.includes(key)) {
        sessionStorage.removeItem(key);
      }
    });
  }
}
