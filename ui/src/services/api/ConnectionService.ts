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

  // Local

  public static getLocalCode() {
    return localStorage.getItem('connectionCode');
  }

  public static saveLocalCode(code: string) {
    localStorage.setItem('connectionCode', code);
  }
}
