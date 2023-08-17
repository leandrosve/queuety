import { Socket } from 'socket.io-client';
import { createSocket } from '../../socket';
import Logger from '../../utils/Logger';

export type APISocketResponse<T> = APISocketSuccessfulResponse<T> | APISocketErrorResponse;

type APISocketSuccessfulResponse<T> = { data: T; hasError: false };
type APISocketErrorResponse = {
  hasError: true;
  errors: string[];
};

export default class APISocketService {
  protected socket: Socket;
  constructor(namespace: string, socket?: Socket) {
    this.socket = socket ?? createSocket(false, namespace);
  }

  public connect() {
    this.socket.connect();
  }

  private logError = <T>(message: string, params?: Object, res?: APISocketResponse<T>) => {
    Logger.danger(`API Returned error for message: ${message} - params: ${JSON.stringify(params)} - res: ${JSON.stringify(res)}`);
  };

  public async emit<T>(message: string, params?: Object): Promise<APISocketResponse<T>> {
    return new Promise((resolve) => {
      this.socket.emit(message, params, (res: APISocketResponse<T>) => {
        if (res.hasError) this.logError(message, params, res);
        resolve(res);
      });
    });
  }

  public async test(authRoomId: string, host?: boolean): Promise<APISocketResponse<boolean>> {
    const res = await this.emit<boolean>('join', { authRoomId, host });

    return res;
  }
}
