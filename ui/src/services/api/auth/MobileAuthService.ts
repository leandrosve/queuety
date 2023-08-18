import AuthResponse from '../../../model/auth/AuthResponse';
import AuthService from './AuthService';
import AuthRequest from '../../../model/auth/AuthRequest';
import Logger from '../../../utils/Logger';

export default class MobileAuthService extends AuthService {
  protected static userId?: string | null;

  public static setUserId(userId: string) {
    this.userId = userId;
  }

  public static cleanup() {
    Logger.debug('Cleanup');
    super.cleanup();
    this._socket.off('connection');
    this._socket.off('disconnect');
    this._socket.off('receive-auth-response');
    this._socket.off('host-reconnected');
    this._socket.off('host-connected');
    this._socket.off('host-disconnected');
    this._socket.off('receive-auth-response');
  }

  public static sendAuthRequest(request: Omit<AuthRequest, 'clientId'>) {
    return this.emit<boolean>('send-auth-request', request);
  }

  public static notifyUserReconnection(nickname: string) {
    return this.emit<boolean>('notify-user-reconnection', { nickname });
  }

  public static notifyUserChanged(nickname: string) {
    if (!this.userId || !this.playerRoomId) return;
    return this.emit<boolean>('notify-user-changed', { nickname, userId: this.userId, playerRoomId: this.playerRoomId });
  }

  public static onAuthConfirmation(callback: (res: AuthResponse) => void) {
    this._socket.on('receive-auth-response', callback);
  }

  public static onAuthRevocation(callback: (res: boolean) => void) {
    this._socket.on('receive-auth-revocation', callback);
  }

  public static onConfirmationTimeout() {
    this._socket.off('receive-auth-response');
  }

  public static onHostReconnected(callback: (res: boolean) => void) {
    this._socket.on('host-reconnected', callback);
  }

  public static onHostDisconnected(callback: (res: AuthResponse) => void) {
    this._socket.on('host-disconnected', callback);
  }

  public static onHostConnected(callback: (res: boolean) => void) {
    this._socket.on('host-connected', callback);
  }
}
