import AuthResponse from '../../../model/auth/AuthResponse';
import AuthService from './AuthService';
import AuthRequest from '../../../model/auth/AuthRequest';

export default class MobileAuthService extends AuthService {
  public cleanup() {
    this.socket.off('connection');
    this.socket.off('disconnect');
    console.log("disabled auth response");
    this.socket.off('receive-auth-response');
  }

  public sendAuthRequest(request: Omit<AuthRequest, 'clientId'>): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit('send-auth-request', request, (res: boolean) => resolve(res));
    });
  }

  public onAuthConfirmation(callback: (res: AuthResponse) => void) {
    this.socket.on('receive-auth-response', callback);
  }

  public onConfirmationTimeout() {
    this.socket.off('receive-auth-response');
  }

  public savePlayerRoom(playerRoomId: string) {
    localStorage.setItem('playerRoomId', playerRoomId);
  }

  public getSavedPlayerRoom() {
    return localStorage.getItem('playerRoomId');
  }
}
