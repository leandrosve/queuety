import { Injectable, Logger } from '@nestjs/common';
import RoomType, { checkRoomType, getRoomType } from '../auth/model/RoomType';
import { Socket } from 'socket.io';
import { JoinPlayerRoomRequestDTO } from '../auth/dto/JoinPlayerRoomRequestDTO';
import { UserChangeDTO } from '../auth/dto/UserChangeDTO';

@Injectable()
export class PlayerConnectionService {
  private readonly logger = new Logger(PlayerConnectionService.name);

  private isHost(client: Socket) {
    return !!client.data?.['host'];
  }

  private userId(client: Socket): string {
    return client.data?.['userId'];
  }

  public onConnection(client: Socket) {
    this.logger.log(`A new device has connected - clientId: ${client.id}`);
    client.emit('connection', client.id);
    client.on('disconnecting', () => {
      this.onDisconnect(client);
    });
  }

  private onDisconnect(client: Socket) {
    const isHost = this.isHost(client);
    for (const room of client.rooms) {
      if (!isHost) {
        client.to(room).emit('user-disconnected', { userId: client.data?.['userId'] });
        continue;
      }
      if ([RoomType.PLAYER].includes(getRoomType(room))) {
        client.to(room).emit('host-disconnected', true);
      }
    }
  }

  public async joinPlayerRoom(client: Socket, dto: JoinPlayerRoomRequestDTO) {
    const { playerRoomId, host, userId, nickname } = dto;
    checkRoomType(playerRoomId, RoomType.PLAYER);
    await client.join(playerRoomId);
    client.data = { ...client.data, host, userId };
    this.notifyConnectionToRoom(client, playerRoomId, nickname);
    return true;
  }

  private notifyConnectionToRoom(client: Socket, roomId: string, nickname: string) {
    if (this.isHost(client)) {
      client.to(roomId).emit('host-reconnected', true);
      return;
    }
    const userId = this.userId(client);
    if (userId) {
      client.to(roomId).emit('user-connected', { userId, clientId: client.id, nickname });
    }
  }

  public async notifyUserConnection(client: Socket, playerRoomId: string, nickname: string) {
    checkRoomType(playerRoomId, RoomType.PLAYER);
    this.notifyUserReconnection(client, playerRoomId, nickname);
    return true;
  }

  public notifyUserReconnection(client: Socket, roomId: string, nickname: string) {
    const userId = this.userId(client);
    if (userId) {
      client.to(roomId).emit('user-reconnected', { userId, clientId: client.id, nickname });
    }
  }

  public sendUserChanged(client: Socket, dto: UserChangeDTO) {
    const { userId, nickname, playerRoomId } = dto;
    checkRoomType(playerRoomId, RoomType.PLAYER);
    client.to(playerRoomId).emit('user-changed', { userId, nickname });
    return true;
  }

  public async notifyHostConnection(client: Socket, clientId: string) {
    if (!this.isHost(client)) return;
    await client.to(clientId).emit('host-connected', true);
    return true;
  }
}
