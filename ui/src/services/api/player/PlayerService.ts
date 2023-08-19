import { Socket } from 'socket.io-client';
import APISocketService from '../APISocketService';
import { playerSocket } from '../../../socket';
import { QueueActionRequest } from '../../../model/queue/QueueActions';

export default class PlayerService extends APISocketService {
  protected static playerRoomId?: string | null;
  public static _socket: Socket = playerSocket;

  public static connect(onConnected?: () => void) {
    if (onConnected) {
      this._socket.on('connection', onConnected);
    }
    console.log('NOT CONNECTED??');
    this._socket.connect();
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

  public static joinPlayerRoom(playerRoomId: string, host: boolean, userId: string, nickname: string) {
    return this.emit<boolean>('join-player-room', { playerRoomId, host, userId, nickname });
  }

  public static sendPlayerAction(playerRoomId: string, action: QueueActionRequest) {
    console.log('EMITED ACTION CAPO', this._socket);
    return this.emit<boolean>('send-player-action', { playerRoomId, action });
  }

  public static onPlayerEvent(callback: (res: any) => void) {
    this._socket.on('receive-player-action', callback);
  }
}
