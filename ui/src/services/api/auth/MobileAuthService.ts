import { Socket } from 'socket.io-client';
import { createSocket } from '../../../socket';
import AuthResponseDTO from '../../../model/auth/AuthResponseDTO';

export default class MobileAuthService {
  private socket: Socket;

  constructor() {
    this.socket = createSocket(false);
  }

  public connect() {
    this.socket.connect();
  }

  public cleanup() {
    this.socket.off('connection');
    this.socket.off('disconnect');
    this.socket.off('receive-auth-confirmation');
  }

  public joinAuthRoom(authRoomId: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit('join-auth-room', { authRoomId }, (res: boolean) => resolve(res));
    });
  }

  public sendAuthRequest(authRoomId: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit('send-auth-request', { authRoomId }, (res: boolean) => resolve(res));
    });
  }

  public joinPlayerRoom(playerRoomId: string, onSuccess: () => void, onError?: () => void) {
    this.socket.emit('join-auth-room', { playerRoomId }, (res: boolean) => (res ? onSuccess : onError)?.());
  }

  public onConnected(callback: (clientId: string) => void) {
    this.socket.on('connection', callback);
  }

  public onDisconnected(callback: () => void) {
    this.socket.on('disconnect', callback);
  }

  public onAuthConfirmation(callback: (res: AuthResponseDTO) => void) {
    this.socket.once('receive-auth-confirmation', callback);
  }

  public onConfirmationTimeout() {
    this.socket.off('receive-auth-confirmation');
  }
}
