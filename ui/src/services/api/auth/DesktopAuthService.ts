import { Socket } from 'socket.io-client';
import { createSocket } from '../../../socket';
import AuthResponse from '../../../model/auth/AuthResponse';
import AuthService from './AuthService';
import AuthRequest from '../../../model/auth/AuthRequest';


export default class DesktopAuthService extends AuthService {
  public cleanup() {
    this.socket.off('connection');
    this.socket.off('disconnect');
    this.socket.off('receive-auth-request');
  }

  public sendAuthResponse(response: AuthResponse): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit('send-auth-response', response, (res:boolean) => resolve(res));
    });
  }

  public onAuthRequested(callback: (res: AuthRequest) => void) {
    this.socket.on('receive-auth-request', callback);
  }
}
