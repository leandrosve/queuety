import APIService from './APIService';
interface ConnectionCode {
  code: string;
}
export default class ConnectionService extends APIService {
  protected static PATH: string = '/connection';

  //API methods
  public static async getConnectionCode() {
    return await this.get<ConnectionCode>(`/code`);
  }

  public static getLocalCode() {
    return localStorage.getItem('connectionCode');
  }

  public static saveLocalCode(code: string) {
    localStorage.setItem('connectionCode', code);
  }
}
