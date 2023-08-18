import AuthResponse from '../../../model/auth/AuthResponse';
import AuthService from './AuthService';
import AuthRequest from '../../../model/auth/AuthRequest';

export default class DesktopAuthService extends AuthService {
  public static cleanup() {
    super.cleanup();
    this._socket.off('connection');
    this._socket.off('disconnect');
    this._socket.off('receive-auth-request');
  }

  public static joinAuthRoom(authRoomId: string) {
    return super.joinAuthRoom(authRoomId, true);
  }

  public static joinPlayerRoom(playerRoomId: string) {
    return super.joinPlayerRoom(playerRoomId, true);
  }

  public static sendAuthResponse(response: AuthResponse) {
    return this.emit('send-auth-response', response);
  }

  public static sendAuthRevocation(userId: string, clientId: string) {
    return this.emit('send-auth-revocation', { userId, clientId });
  }

  /**
   * Used to personally notify a user when desktop is connected when they join the room
   */
  public static notifyHostConnection(clientId: string) {
    return this.emit('notify-host-connection', { clientId });
  }

  public static onAuthRequested(callback: (res: AuthRequest) => void) {
    this._socket.on('receive-auth-request', callback);
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
