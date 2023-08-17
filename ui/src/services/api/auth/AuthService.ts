import { Socket } from 'socket.io-client';
import { createSocket } from '../../../socket';

export default class AuthService {
  protected socket: Socket;

  constructor(socket?: Socket) {
    this.socket = socket ?? createSocket(false);
  }

  public connect() {
    this.socket.connect();
  }

  public cleanup() {
    this.socket.off('connection');
    this.socket.off('disconnect');
  }

  public joinAuthRoom(authRoomId: string, host?: boolean): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit('join-auth-room', { authRoomId, host }, (res: boolean) => {
        resolve(res);
      });
    });
  }

  public joinPlayerRoom(playerRoomId: string, host?: boolean, userId?: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit('join-player-room', { playerRoomId, host, userId }, (res: boolean) => resolve(res));
    });
  }

  public onConnected(callback: (clientId: string) => void) {
    this.socket.on('connection', callback);
  }

  public onDisconnected(callback: () => void) {
    this.socket.on('disconnect', callback);
  }
}
