import { Socket } from 'socket.io-client';
import APISocketService from '../APISocketService';

export default class AuthService extends APISocketService {
  protected authRoomId?: string | null;
  protected playerRoomId?: string | null;

  protected constructor(socket?: Socket) {
    super('/auth', socket);
  }

  public setAuthRoomId(authRoomId?: string | null) {
    this.authRoomId = authRoomId;
  }
  public setPlayerRoomId(playerRoomId?: string | null) {
    this.playerRoomId = playerRoomId;
  }

  public cleanup() {
    this.socket.off('connection');
    this.socket.off('disconnect');
  }

  public joinAuthRoom(authRoomId: string, host?: boolean) {
    return this.emit<boolean>('join-auth-room', { authRoomId, host });
  }

  public joinPlayerRoom(playerRoomId: string, host?: boolean, userId?: string, nickname?: string) {
    return this.emit<boolean>('join-player-room', { playerRoomId, host, userId, nickname });
  }

  public onConnected(callback: (clientId: string) => void) {
    this.socket.on('connection', callback);
  }

  public onDisconnected(callback: () => void) {
    this.socket.on('disconnect', callback);
  }
}
