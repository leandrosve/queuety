import { Socket } from 'socket.io-client';
import APISocketService from '../APISocketService';
import { authSocket } from '../../../socket';

export default class AuthService extends APISocketService {
  public static _socket: Socket = authSocket;

  public static connect(onConnected?: (clientId: string) => void) {
    if (onConnected) {
      this._socket.on('connection', onConnected);
    }
    this._socket.connect();
  }

  public static restart(): Promise<void> {
    return new Promise((res) => {
      this._socket.once('connection', res);
      this._socket.disconnect();
      this._socket.connect();
    });
  }

  public static cleanup() {
    this._socket.disconnect();
    this._socket.off('connection');
    this._socket.off('disconnect');
  }

  public static joinAuthRoom(authRoomId: string, host: boolean, userId: string) {
    return this.emit<boolean>('join-auth-room', { authRoomId, host, userId });
  }

  public static leaveAuthRoom(authRoomId: string) {
    return this.emit<boolean>('leave-auth-room', { authRoomId });
  }

  public static onConnected(callback: (clientId: string) => void) {
    this._socket.on('connection', callback);
  }

  public static onDisconnected(callback: () => void) {
    this._socket.on('disconnect', callback);
  }
}
