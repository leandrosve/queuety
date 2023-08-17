import { Socket } from 'socket.io-client';
import APISocketService from '../APISocketService';

export default class AuthService extends APISocketService {
  constructor(socket?: Socket) {
    super('/auth', socket);
  }

  public cleanup() {
    this.socket.off('connection');
    this.socket.off('disconnect');
  }

  public joinAuthRoom(authRoomId: string, host?: boolean) {
    return this.emit<boolean>('join-auth-room', { authRoomId, host });
  }

  public joinPlayerRoom(playerRoomId: string, host?: boolean, userId?: string) {
    return this.emit<boolean>('join-player-room', { playerRoomId, host, userId });
  }

  public onConnected(callback: (clientId: string) => void) {
    this.socket.on('connection', callback);
  }

  public onDisconnected(callback: () => void) {
    this.socket.on('disconnect', callback);
  }
}
