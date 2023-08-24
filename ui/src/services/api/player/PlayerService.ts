import { Socket } from 'socket.io-client';
import APISocketService from '../APISocketService';
import { playerSocket } from '../../../socket';

export default abstract class PlayerService extends APISocketService {
  protected static playerRoomId?: string | null;
  protected static userId?: string | null;
  public static _socket: Socket = playerSocket;
  protected static clientId: string | null;
  protected static _isReady: boolean = false;

  public static connect(onConnected?: (clientIc: string) => void) {
    this._socket.on('connection', (clientId: string) => {
      this.clientId = clientId;
      this._isReady = true;
      onConnected?.(clientId);
    });
    this._socket.connect();
  }

  public static isReady() {
    return this._isReady;
  }
  public static restart() {
    this._socket.disconnect();
    this._socket.connect();
  }

  public static cleanup() {
    this._socket.off('connection');
    this._socket.off('disconnect');
  }

  protected static joinRoom(playerRoomId: string, host?: boolean, userId?: string, nickname?: string) {
    this.playerRoomId = playerRoomId;
    this.userId = userId;
    return this.emit<boolean>('join-player-room', { playerRoomId, host, userId, nickname });
  }
}
