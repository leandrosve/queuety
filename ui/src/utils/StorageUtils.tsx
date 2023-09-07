import Logger from './Logger';

export enum StorageKey {
  DEBUG_MODE = 'debugMode',
  QUEUE = 'queue',
  SETTINGS = 'settings',
  CONNECTION_SETTINGS = 'connectionSettings',
  ALLOWED_USERS = 'allowedUsers',
  USER_ID = 'userId',
  PLAYER_ROOM_ID = 'playerRoomId',
  AUTH_ROOM_ID = 'authRoomId',
  HOST = 'host',
  DEVICE = 'device',
  REJECTIONS = 'rejections',
  REJECTED_USERS = 'rejected_devices',
  LAST_QUEUE_EVENT_ID = 'lastQueueEventId',
}

export default class StorageUtils {
  public static set(key: StorageKey, data: string) {
    localStorage.setItem(key, data);
  }

  public static get(key: StorageKey) {
    return localStorage.getItem(key);
  }

  public static getParsed<T>(key: StorageKey, defaultValue: T) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      Logger.danger(`Error while parsing Stored data - key: ${key}`);
      return defaultValue;
    }
  }

  public static setRaw<T>(key: StorageKey, data: T) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      Logger.danger(`Error while serializing data for storage - key: ${key}`);
    }
  }

  public static remove(key: StorageKey) {
    localStorage.removeItem(key);
  }

  public static clear(keys?: StorageKey[]) {
    if (!keys) {
      localStorage.clear();
      return;
    }
    keys.forEach((k) => localStorage.removeItem(k));
  }

  public static clearAll(options?: { exceptions?: StorageKey[] }) {
    Object.values(StorageKey).forEach((key) => {
      if (!options?.exceptions?.includes(key)) {
        localStorage.removeItem(key);
      }
    });
  }
}
