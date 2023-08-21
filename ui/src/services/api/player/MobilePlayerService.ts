import { Queue } from '../../../model/queue/Queue';
import { QueueActionRequest } from '../../../model/queue/QueueActions';
import PlayerService from './PlayerService';

export default class MobilePlayerService extends PlayerService {
  public static joinPlayerRoom(playerRoomId: string, userId: string, nickname: string) {
    return super.joinRoom(playerRoomId, false, userId, nickname);
  }

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

  public static onAuthRevocation(callback: (res: boolean) => void) {
    this._socket.on('receive-auth-revocation', callback);
  }

  public static sendMobilePlayerAction(playerRoomId: string, action: QueueActionRequest) {
    return this.emit<boolean>('send-mobile-player-action', { playerRoomId, action });
  }

  public static onPlayerEvent(callback: (res: QueueActionRequest) => void) {
    this._socket.on('receive-player-event', callback);
  }

  public static sendCompletePlayerStatusRequest() {
    return this.emit<boolean>('send-complete-player-status-request', { playerRoomId: this.playerRoomId, clientId: this.clientId });
  }

  public static onCompletePlayerStatus(callback: (res: { queue: Queue }) => void) {
    this._socket.once('receive-complete-player-status', callback);
  }
}