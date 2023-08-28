import { PlayerStatusAction } from '../../../model/player/PlayerActions';
import PlayerStatus from '../../../model/player/PlayerStatus';
import { InitializeAction, QueueActionRequest } from '../../../model/queue/QueueActions';
import PlayerService from './PlayerService';

export default class DesktopPlayerService extends PlayerService {
  public static joinPlayerRoom(playerRoomId: string, userId: string, nickname: string) {
    return super.joinRoom(playerRoomId, true, userId, nickname);
  }

  public static notifyHostConnection(clientId: string, nickname: string, userId: string) {
    return this.emit('notify-host-connection', { clientId, nickname, userId });
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

  public static onCompleteQueueRequest(callback: (res: { clientId: string }) => void) {
    this._socket.on('receive-complete-queue-request', callback);
  }

  public static sendCompleteQueue(clientId: string, action: InitializeAction) {
    return this.emit('send-complete-queue', { clientId, action });
  }

  public static sendPlayerStatus(playerRoomId: string, status: Partial<PlayerStatus>) {
    return this.emit('send-player-status', { playerRoomId, status });
  }

  public static sendPlayerAction(playerRoomId: string, action: QueueActionRequest) {
    return this.emit<boolean>('send-player-event', { playerRoomId, action });
  }

  public static sendAuthRevocation(userId: string, clientId: string) {
    return this.emit('notify-auth-revocation', { userId, clientId });
  }

  public static onMobilePlayerEvent(callback: (res: QueueActionRequest) => void) {
    this._socket.on('receive-mobile-player-event', callback);
  }

  public static onPlayerStatusAction(callback: (res: PlayerStatusAction) => void) {
    this._socket.on('receive-player-status-action', callback);
  }
}
