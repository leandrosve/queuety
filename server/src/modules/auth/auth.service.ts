import { Injectable, Logger } from '@nestjs/common';
import { createHash, sign, createSign } from 'crypto';
import { Socket } from 'socket.io';
import RoomType from './model/RoomType';
import { skip } from 'node:test';
import { JoinPlayerRoomRequestDTO } from './dto/JoinPlayerRoomRequestDTO';
import { AuthRequestDTO } from './dto/AuthRequestDTO';
import { AuthResponseDTO } from './dto/AuthResponseDTO';
import { AuthResponseStatus } from './model/AuthResponseStatus';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketServer, WebSocketGateway } from '@nestjs/websockets';
import { Server as SocketServer } from 'socket.io';
import { UserChangeDTO } from './dto/UserChangeDTO';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  @WebSocketServer()
  private server: SocketServer;
  private isHost(client: Socket) {
    return !!client.data?.['host'];
  }

  private userId(client: Socket): string {
    return client.data?.['userId'];
  }

  private roomType(room: string): RoomType {
    return Object.values(RoomType).find((type) => room.startsWith(type + '-')) ?? RoomType.INVALID;
  }

  private isRoomType(room: string, type: RoomType, log = true): boolean {
    const valid = this.roomType(room) == type;
    if (!valid && log) this.logger.warn(`${room} is not a valid ${type} room ID`);
    return valid;
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
    this.logger.log("capo por que carajo no te unis");
    if (!this.isRoomType(authRoomId, RoomType.AUTH)) return false;
    //this.leaveAuthRooms(client);
    await client.join(authRoomId);
    this.logger.log(`${client.id} connected to auth room ${authRoomId}`);

    return true;
  }

  public async joinPlayerRoom(client: Socket, dto: JoinPlayerRoomRequestDTO) {
    const { playerRoomId, host, userId, nickname } = dto;
    if (!this.isRoomType(playerRoomId, RoomType.PLAYER)) return false;
    await client.join(playerRoomId);
    client.data = { ...client.data, host, userId };
    this.logger.log(`${client.id} joined player room ${playerRoomId} as ${host ? 'host' : 'guest'}`);
    if (!this.isHost(client)) {
      this.leaveAuthRooms(client);
    }
    this.notifyConnectionToRoom(client, playerRoomId, nickname);
    return true;
  }

  private leaveAuthRooms(client: Socket) {
    for (const room of client.rooms) {
      if (this.isRoomType(room, RoomType.AUTH, false)) {
        client.leave(room);
      }
    }
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

  public notifyUserReconnection(client: Socket, roomId: string, nickname: string) {
    const userId = this.userId(client);
    if (userId) {
      client.to(roomId).emit('user-reconnected', { userId, clientId: client.id, nickname });
    }
  }

  public async notifyUserConnection(client: Socket, nickname: string) {
    for (const room of client.rooms) {
      if (this.isRoomType(room, RoomType.PLAYER, false)) {
        this.notifyUserReconnection(client, room, nickname);
      }
    }
    return true;
  }

  public sendUserChanged(client: Socket, dto: UserChangeDTO) {
    const { userId, nickname, playerRoomId } = dto;
    if (!this.isRoomType(playerRoomId, RoomType.PLAYER)) return false;
    client.to(playerRoomId).emit('user-changed', { userId, nickname });
    return true;
  }

  public async notifyHostConnection(client: Socket, clientId: string) {
    if (!this.isHost(client)) return;
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

  public sendAuthRevocation(client: Socket, clientId: string) {
    this.logger.log(`Host revoked authorization for clientId ${clientId}`);
    client.to(clientId).emit('receive-auth-revocation', clientId);
    return true;
  }
}
