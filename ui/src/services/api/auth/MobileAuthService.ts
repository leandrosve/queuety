import AuthResponse from '../../../model/auth/AuthResponse';
import AuthService from './AuthService';
import AuthRequest from '../../../model/auth/AuthRequest';

export default class MobileAuthService extends AuthService {
  public cleanup() {
    this.socket.off('connection');
    this.socket.off('disconnect');
    this.socket.off('receive-auth-response');
  }

  public sendAuthRequest(request: Omit<AuthRequest, 'clientId'>) {
    return this.emit<boolean>('send-auth-request', request);
  }

  public notifyUserReconnection() {
    return this.emit<boolean>('notify-user-reconnection');
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
