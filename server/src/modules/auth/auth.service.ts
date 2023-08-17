import { Injectable, Logger } from '@nestjs/common';
import { createHash, sign, createSign } from 'crypto';
import { Socket } from 'socket.io';
import RoomType from './model/RoomType';
import { skip } from 'node:test';
import { JoinPlayerRoomRequestDTO } from './dto/JoinPlayerRoomRequestDTO';
import { AuthRequestDTO } from './dto/AuthRequestDTO';
import { AuthResponseDTO } from './dto/AuthResponseDTO';
import { AuthResponseStatus } from './model/AuthResponseStatus';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private isHost(client: Socket) {
    return !!client.data?.['host'];
  }

  private userId(client: Socket): string {
    return client.data?.['userId'];
  }

  private roomType(room: string): RoomType {
    return Object.values(RoomType).find((type) => room.startsWith(type)) ?? RoomType.INVALID;
  }

  private isRoomType(room: string, type: RoomType): boolean {
    return this.roomType(room) == type;
  }

  public onConnect(client: Socket) {
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
      if ([RoomType.PLAYER, RoomType.AUTH].includes(this.roomType(room))) {
        client.to(room).emit('host-disconnected', true);
      }
    }
  }

  public async joinAuthRoom(client: Socket, authRoomId: string) {
    if (this.roomType(authRoomId) !== RoomType.AUTH) {
      this.logger.warn(`${authRoomId} is not a valid auth room ID`);
      return false;
    }
    //this.leaveAuthRooms(client);
    await client.join(authRoomId);
    this.logger.log(`${client.id} connected to auth room ${authRoomId}`);

    return true;
  }

  public async joinPlayerRoom(client: Socket, dto: JoinPlayerRoomRequestDTO) {
    const { playerRoomId, host, userId } = dto;
    if (!this.isRoomType(playerRoomId, RoomType.PLAYER)) {
      this.logger.warn(`${playerRoomId} is not a valid player room ID`);
      return false;
    }
    await client.join(playerRoomId);
    client.data = { ...client.data, host, userId };
    this.logger.log(`${client.id} joined player room ${playerRoomId} as ${host ? 'host' : 'guest'}`);
    if (!this.isHost(client)) {
      this.leaveAuthRooms(client);
    }
    this.notifyConnectionToRoom(client, playerRoomId);
    return true;
  }

  private leaveAuthRooms(client: Socket) {
    for (const room of client.rooms) {
      if (this.isRoomType(room, RoomType.AUTH)) {
        client.leave(room);
      }
    }
  }

  private notifyConnectionToRoom(client: Socket, roomId: string) {
    if (this.isHost(client)) {
      client.to(roomId).emit('host-reconnected', true);
      return;
    }
    const userId = this.userId(client);
    if (userId) {
      client.to(roomId).emit('user-connected', { userId, clientId: client.id });
    }
  }

  public notifyUserReconnection(client: Socket, roomId: string) {
    const userId = this.userId(client);
    if (userId) {
      client.to(roomId).emit('user-reconnected', { userId, clientId: client.id });
    }
  }

  public async notifyUserConnection(client: Socket) {
    for (const room of client.rooms) {
      if (this.isRoomType(room, RoomType.PLAYER)) {
        this.notifyUserReconnection(client, room);
      }
    }
    return true;
  }

  public async notifyHostConnection(client: Socket, clientId: string) {
    if (!this.isHost(client)) return;
    this.logger.log('che, le estoy mandando que me conecte al boludo de ' + clientId);
    await client.to(clientId).emit('host-connected', true);
    return true;
  }

  public async sendAuthRequest(client: Socket, dto: AuthRequestDTO) {
    if (!this.isRoomType(dto.authRoomId, RoomType.AUTH)) return;
    await client.to(dto.authRoomId).emit('receive-auth-request', { ...dto, clientId: client.id });
    this.logger.log(`${client.id} sent auth request to auth room ${dto.authRoomId}`);
    return true;
  }

  public sendAuthResponse(client: Socket, dto: AuthResponseDTO) {
    if (dto.status === AuthResponseStatus.DENIED) {
      this.logger.warn(`${client.id} denied auth request to join client ${dto.clientId} to player room ${dto.playerRoomId}`);
    } else if (dto.status === 'AUTHORIZED') {
      this.logger.log(`${client.id} authorized request to join client ${dto.clientId}`);
    }
    client.to(dto.clientId).emit('receive-auth-response', dto);
    return true;
  }
}
