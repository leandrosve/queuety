import AuthResponse from '../../../model/auth/AuthResponse';
import AuthService from './AuthService';
import AuthRequest from '../../../model/auth/AuthRequest';

export default class MobileAuthService extends AuthService {
  public cleanup() {
    this.socket.off('connection');
    this.socket.off('disconnect');
    this.socket.off('receive-auth-response');
  }

  public sendAuthRequest(request: Omit<AuthRequest, 'clientId'>): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit('send-auth-request', request, (res: boolean) => resolve(res));
    });
  }

  public notifyUserReconnection(): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit('notify-user-reconnection', null, (res: boolean) => resolve(res));
    });
  }

  public onAuthConfirmation(callback: (res: AuthResponse) => void) {
    this.socket.on('receive-auth-response', callback);
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
}
