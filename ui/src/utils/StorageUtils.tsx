export enum StorageKey {
  DEBUG_MODE = 'debugMode',
  QUEUE = 'queue',
  SETTINGS = 'settings',
  CONNECTION_SETTINGS = 'connection_settings',
  ALLOWED_USERS = 'allowedUsers',
  USER_ID = 'userId',
  PLAYER_ROOM_ID = 'playerRoomId',
  AUTH_ROOM_ID = 'authRoomId',
  HOST = 'host',
}

export default class StorageUtils {
  public static set(key: StorageKey, data: string) {
    localStorage.setItem(key, data);
  }

  public static get(key: StorageKey) {
    return localStorage.getItem(key);
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
