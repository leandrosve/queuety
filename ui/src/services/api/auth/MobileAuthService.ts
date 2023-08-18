import AuthResponse from '../../../model/auth/AuthResponse';
import AuthService from './AuthService';
import AuthRequest from '../../../model/auth/AuthRequest';

export default class MobileAuthService extends AuthService {
  private static _instance: MobileAuthService;
  protected userId?: string | null;

  public static getInstance(): MobileAuthService {
    if (MobileAuthService._instance) {
      return MobileAuthService._instance;
    }
    this._instance = new MobileAuthService();
    return this._instance;
  }

  public setUserId(userId: string) {
    this.userId = userId;
  }

  public cleanup() {
    this.socket.off('connection');
    this.socket.off('disconnect');
    this.socket.off('receive-auth-response');
  }

  public sendAuthRequest(request: Omit<AuthRequest, 'clientId'>) {
    return this.emit<boolean>('send-auth-request', request);
  }

  public notifyUserReconnection(nickname: string) {
    return this.emit<boolean>('notify-user-reconnection', {nickname});
  }

  public notifyUserChanged(nickname: string) {
    if (!this.userId || !this.playerRoomId) return;
    console.log('holaaaa');
    return this.emit<boolean>('notify-user-changed', { nickname, userId: this.userId, playerRoomId: this.playerRoomId });
  }

  public onAuthConfirmation(callback: (res: AuthResponse) => void) {
    this.socket.on('receive-auth-response', callback);
  }

  public onAuthRevocation(callback: (res: boolean) => void) {
    this.socket.on('receive-auth-revocation', callback);
  }

  public onConfirmationTimeout() {
    this.socket.off('receive-auth-response');
  }

  public onHostReconnected(callback: (res: boolean) => void) {
    this.socket.on('host-reconnected', callback);
  }

  public onHostDisconnected(callback: (res: AuthResponse) => void) {
    this.socket.on('host-disconnected', callback);
  }

  public onHostConnected(callback: (res: boolean) => void) {
    this.socket.on('host-connected', callback);
  }

  public savePlayerRoom(playerRoomId: string) {
    localStorage.setItem('playerRoomId', playerRoomId);
  }

  public getSavedPlayerRoom() {
    return localStorage.getItem('playerRoomId');
  }

  public removeSavedPlayerRoom() {
    return localStorage.removeItem('playerRoomId');
  }
}
