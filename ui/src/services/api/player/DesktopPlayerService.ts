import { Queue } from '../../../model/queue/Queue';
import { QueueActionRequest } from '../../../model/queue/QueueActions';
import PlayerService from './PlayerService';

export default class DesktopPlayerService extends PlayerService {
  public static joinPlayerRoom(playerRoomId: string) {
    return super.joinRoom(playerRoomId, true);
  }

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

  public static onCompletePlayerStatusRequest(callback: (res: { clientId: string }) => void) {
    this._socket.on('receive-complete-player-status-request', callback);
  }

  public static sendCompletePlayerStatus(clientId: string, queue: Queue) {
    return this.emit('send-complete-player-status', { clientId, queue });
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

}
