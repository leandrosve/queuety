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
    return super.joinAuthRoom(authRoomId, true, '');
  }

  public static sendAuthResponse(response: AuthResponse) {
    return this.emit('send-auth-response', response);
  }

  /**
   * Used to personally notify a user when desktop is connected when they join the room
   */

  public static onAuthRequested(callback: (res: AuthRequest) => void) {
    this._socket.off('receive-auth-request');
    this._socket.on('receive-auth-request', callback);
  }
}
