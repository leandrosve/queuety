import { Injectable, Logger } from '@nestjs/common';
import RoomType, { checkRoomType } from '../auth/model/RoomType';
import { Socket } from 'socket.io';
import { QueueActionRequest } from './model/QueueActions';

@Injectable()
export class PlayerEventsService {
  private readonly logger = new Logger(PlayerEventsService.name);

  public sendPlayerAction(client: Socket, playerRoomId: string, action: QueueActionRequest) {
    checkRoomType(playerRoomId, RoomType.PLAYER);
    this.logger.log(`Send action request for ${playerRoomId} ${action.actionId}`);
    client.to(playerRoomId).emit('receive-player-action', action);
    return true;
  }
}
