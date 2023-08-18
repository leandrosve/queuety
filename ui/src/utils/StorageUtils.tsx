export enum StorageKey {
  PLAYER_ROOM_ID = 'playerRoomId',
}

export default class StorageUtils {
  public static save(key: StorageKey, data: object) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  public static get<T>(key: StorageKey) {
    localStorage.getItem(key) as T;
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
