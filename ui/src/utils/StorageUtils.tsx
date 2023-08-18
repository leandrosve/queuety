export enum StorageKey {
  DEBUG_MODE = 'debugMode',
  CONNECTION = 'connection',
  QUEUE = 'queue',
  SETTINGS = 'settings',
  ALLOWED_USERS = 'allowedUsers',
  USER_ID = 'userId',

  PLAYER_ROOM_ID = 'playerRoomId',
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
}
