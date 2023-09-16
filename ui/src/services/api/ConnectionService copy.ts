import APIService from './APIService';

export default class StatusService extends APIService {
  public static async getStatus() {
    return await this.get<{ status: string }>(`/status`);
  }
}
