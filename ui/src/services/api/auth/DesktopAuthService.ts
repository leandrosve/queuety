import AuthResponse from '../../../model/auth/AuthResponse';
import AuthService from './AuthService';
import AuthRequest from '../../../model/auth/AuthRequest';

export default class DesktopAuthService extends AuthService {
  public cleanup() {
    this.socket.off('connection');
    this.socket.off('disconnect');
    this.socket.off('receive-auth-request');
  }

  public joinAuthRoom(authRoomId: string) {
    return super.joinAuthRoom(authRoomId, true);
  }

  public joinPlayerRoom(playerRoomId: string) {
    return super.joinPlayerRoom(playerRoomId, true);
  }

  public sendAuthResponse(response: AuthResponse) {
    return this.emit('send-auth-response', response);
  }

  /**
   * Used to personally notify a user when desktop is connected when they join the room
   */
  public notifyHostConnection(clientId: string) {
    return this.emit('notify-host-connection', { clientId });
  }

  public onAuthRequested(callback: (res: AuthRequest) => void) {
    this.socket.on('receive-auth-request', callback);
  }

  public onUserConnected(callback: (res: { userId: string; clientId: string }) => void) {
    this.socket.on('user-connected', callback);
  }

  public onUserReconnected(callback: (res: { userId: string; clientId: string }) => void) {
    this.socket.on('user-reconnected', callback);
  }

  public onUserDisconnected(callback: (res: { userId: string }) => void) {
    this.socket.on('user-disconnected', callback);
  }
}
