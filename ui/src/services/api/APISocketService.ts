import { Socket } from 'socket.io-client';
import Logger from '../../utils/Logger';

export type APISocketResponse<T> = APISocketSuccessfulResponse<T> | APISocketErrorResponse;

type APISocketSuccessfulResponse<T> = { data: T; hasError: false };
type APISocketErrorResponse = {
  hasError: true;
  errors: string[];
};

export default class APISocketService {
  protected static _socket: Socket;
  private static logRequests: boolean = true;

  public static connect() {
    this._socket.connect();
  }

  private static logError = <T>(message: string, params?: Object, res?: APISocketResponse<T>) => {
    Logger.danger(`API Returned error for message: ${message} - params: ${JSON.stringify(params)} - res: ${JSON.stringify(res)}`);
  };

  public static async emit<T>(message: string, params?: Object, extraOptions?: { disableLog?: boolean }): Promise<APISocketResponse<T>> {
    return new Promise((resolve) => {
      if (this.logRequests && !extraOptions?.disableLog) Logger.socket('Socket - sending message: ' + message);
      this._socket.emit(message, params, (res: APISocketResponse<T>) => {
        if (res.hasError) this.logError(message, params, res);
        resolve(res);
      });
    });
  }

  public static async test(authRoomId: string, host?: boolean): Promise<APISocketResponse<boolean>> {
    const res = await this.emit<boolean>('join', { authRoomId, host });
    return res;
  }
}
