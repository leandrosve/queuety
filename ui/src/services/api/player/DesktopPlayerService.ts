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

  public static sendAuthRevocation(userId: string, clientId: string) {
    return this.emit('notify-auth-revocation', { userId, clientId });
  }
}
