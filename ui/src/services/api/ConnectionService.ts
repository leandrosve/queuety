import APIService from './APIService';

interface Room {
  roomId: string;
}

export default class ConnectionService extends APIService {
  protected static PATH: string = '/connection';

  //API methods
  public static async getPlayerRoomId() {
    return await this.post<Room>(`/player`);
  }

  public static async getAuthRoomId() {
    return await this.post<Room>(`/auth`);
  }

  public static async getUserId() {
    return await this.post<{ userId: string }>(`/user`);
  }

  public static getLinkForAuthRoomId(authRoomId: string) {
    return `${location.origin}/?auth=${authRoomId.replace('auth-', '')}`;
  }
}
