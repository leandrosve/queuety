import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import RoomType from '../auth/model/RoomType';
import { Socket } from 'socket.io';
import { QueueActionRequest } from './model/QueueActions';
import { JoinPlayerRoomRequestDTO } from '../auth/dto/JoinPlayerRoomRequestDTO';
@Injectable()
export class PlayerService {
  private readonly logger = new Logger(PlayerService.name);

  private roomType(room: string): RoomType {
    return Object.values(RoomType).find((type) => room.startsWith(type + '-')) ?? RoomType.INVALID;
  }
  private checkRoomType(room: string, type: RoomType, log = true): boolean {
    const valid = this.roomType(room) == type;
    if (!valid && log) {
      throw new BadRequestException(`Provided room is not a valid ${type} room`);
    }
    return valid;
  }

  public onConnection(client: Socket) {
    this.logger.log(`A new device has connected - clientId: ${client.id}`);
    client.emit('connection', client.id);
  }

  public async joinPlayerRoom(client: Socket, dto: JoinPlayerRoomRequestDTO) {
    const { playerRoomId, host, userId } = dto;
    this.checkRoomType(playerRoomId, RoomType.PLAYER);
    await client.join(playerRoomId);
    client.data = { ...client.data, host, userId };
    return true;
  }

  public async sendPlayerAction(client: Socket, playerRoomId: string, action: QueueActionRequest) {
    this.checkRoomType(playerRoomId, RoomType.PLAYER);
    this.logger.log(`Send action request for ${playerRoomId} ${action.actionId}`);
    client.to(playerRoomId).emit('receive-player-action', action);
    return true;
  }
}
