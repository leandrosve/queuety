import { Socket } from 'socket.io-client';
import APISocketService from '../APISocketService';
import { authSocket } from '../../../socket';

export default class AuthService extends APISocketService {
  protected static authRoomId?: string | null;
  protected static playerRoomId?: string | null;
  public static _socket: Socket = authSocket;

  public static setAuthRoomId(authRoomId?: string | null) {
    this.authRoomId = authRoomId;
  }
  public static setPlayerRoomId(playerRoomId?: string | null) {
    this.playerRoomId = playerRoomId;
  }

  public static restart() {
    this._socket.disconnect();
    this._socket.connect();
  }

  public static cleanup() {
    this._socket.off('connection');
    this._socket.off('disconnect');
  }

  public static joinAuthRoom(authRoomId: string, host?: boolean) {
    return this.emit<boolean>('join-auth-room', { authRoomId, host });
  }

  public static joinPlayerRoom(playerRoomId: string, host?: boolean, userId?: string, nickname?: string) {
    return this.emit<boolean>('join-player-room', { playerRoomId, host, userId, nickname });
  }

  public static onConnected(callback: (clientId: string) => void) {
    this._socket.on('connection', callback);
  }

  public static onDisconnected(callback: () => void) {
    this._socket.on('disconnect', callback);
  }
}
