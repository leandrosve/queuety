import { PlayerStatusAction } from '../../../model/player/PlayerActions';
import PlayerStatus from '../../../model/player/PlayerStatus';
import { InitializeAction, QueueActionRequest } from '../../../model/queue/QueueActions';
import Logger from '../../../utils/Logger';
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

  public static onHostReconnected(callback: (res: { userId: string; clientId: string; nickname: string }) => void) {
    this._socket.on('host-reconnected', callback);
  }

  public static onHostDisconnected(callback: () => void) {
    this._socket.on('host-disconnected', callback);
  }

  public static onHostConnected(callback: (res: { nickname: string; userId: string }) => void) {
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

  public static sendCompleteQueueRequest() {
    return this.emit<boolean>('send-complete-queue-request', { playerRoomId: this.playerRoomId, clientId: this.clientId });
  }

  public static onCompleteQueue(callback: (res: InitializeAction) => void) {
    this._socket.once('receive-complete-queue', callback);
  }

  public static onPlayerStatus(callback: (res: { timestamp?: number; status: Partial<PlayerStatus> }) => void) {
    this._socket.on('receive-player-status', callback);
  }

  public static sendPlayerStatusAction(action: PlayerStatusAction) {
    Logger.socket('Sending Player Status Action', action.type);
    return this.emit<boolean>('send-player-status-action', { playerRoomId: this.playerRoomId, action }, { disableLog: true });
  }
}
