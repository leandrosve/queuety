import { Socket } from 'socket.io-client';
import APISocketService from '../APISocketService';
import { playerSocket } from '../../../socket';
import { QueueActionRequest } from '../../../model/queue/QueueActions';

export default abstract class PlayerService extends APISocketService {
  protected static playerRoomId?: string | null;
  protected static userId?: string | null;
  public static _socket: Socket = playerSocket;

  public static connect(onConnected?: () => void) {
    if (onConnected) {
      this._socket.on('connection', onConnected);
    }
    this._socket.connect();
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

  /* Move these to a specific MobilePlayerService */
  public static notifyUserReconnection(nickname?: string) {
    return this.emit<boolean>('notify-user-reconnection', { playerRoomId: this.playerRoomId, nickname });
  }

  public static notifyUserChanged(nickname: string) {
    if (!this.userId) return;
    return this.emit<boolean>('notify-user-changed', { nickname, userId: this.userId, playerRoomId: this.playerRoomId });
  }

  public static onHostReconnected(callback: (res: boolean) => void) {
    this._socket.on('host-reconnected', callback);
  }

  public static onHostDisconnected(callback: () => void) {
    this._socket.on('host-disconnected', callback);
  }

  public static onHostConnected(callback: (res: boolean) => void) {
    this._socket.on('host-connected', callback);
  }

  public static sendPlayerAction(playerRoomId: string, action: QueueActionRequest) {
    console.log('EMITED ACTION CAPO', this._socket);
    return this.emit<boolean>('send-player-action', { playerRoomId, action });
  }

  public static onPlayerEvent(callback: (res: any) => void) {
    this._socket.on('receive-player-action', callback);
  }

  /* Move these to a specific DesktopPlayerService */

  public static notifyHostConnection(clientId: string) {
    return this.emit('notify-host-connection', { clientId });
  }

  public static onUserConnected(callback: (res: { userId: string; clientId: string; nickname: string }) => void) {
    this._socket.on('user-connected', callback);
  }

  public static onUserReconnected(callback: (res: { userId: string; clientId: string; nickname: string }) => void) {
    this._socket.on('user-reconnected', callback);
  }

  public static onUserDisconnected(callback: (res: { userId: string }) => void) {
    this._socket.on('user-disconnected', callback);
  }

  public static onUserChanged(callback: (res: { userId: string; nickname: string }) => void) {
    this._socket.on('user-changed', callback);
  }
}
