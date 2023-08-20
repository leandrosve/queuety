import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { Socket } from 'socket.io';
import RoomType, { getRoomType } from './model/RoomType';
import { AuthRequestDTO } from './dto/AuthRequestDTO';
import { AuthResponseDTO } from './dto/AuthResponseDTO';
import { AuthResponseStatus } from './model/AuthResponseStatus';
import { JoinAuthRoomRequestDTO } from './dto/JoinAuthRoomRequestDTO';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private isHost(client: Socket) {
    return !!client.data?.['host'];
  }

  private isRoomType(room: string, type: RoomType, log = true): boolean {
    const valid = getRoomType(room) == type;
    if (!valid && log) this.logger.warn(`${room} is not a valid ${type} room ID`);
    return valid;
  }

  private checkRoomType(room: string) {
    if (this.isRoomType(room, RoomType.AUTH)) return;
    throw new BadRequestException(`Provided room is not a valid player room`);
  }

  public onConnect(client: Socket) {
    this.logger.log(`A new device has connected - clientId: ${client.id}`);
    client.emit('connection', client.id);
    client.on('disconnecting', () => {
      this.onDisconnect(client);
    });
  }

  private onDisconnect(client: Socket) {
    if (!this.isHost(client)) return;
    for (const room of client.rooms) {
      if (this.isRoomType(room, RoomType.AUTH)) {
        client.to(room).emit('host-disconnected', true);
      }
    }
  }

  public async joinAuthRoom(client: Socket, dto: JoinAuthRoomRequestDTO) {
    const { host, userId, authRoomId } = dto;
    this.logger.log('capo por que carajo no te unis');
    this.checkRoomType(authRoomId);
    await client.join(authRoomId);
    this.logger.log(`UserId: ${client.id} (clientId: ${client.id}) connected to auth room ${authRoomId}`);
    client.data = { ...client.data, host, userId };
    return true;
  }

  public async sendAuthRequest(client: Socket, dto: AuthRequestDTO) {
    this.checkRoomType(dto.authRoomId);
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
