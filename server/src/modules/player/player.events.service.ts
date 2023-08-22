import { Injectable, Logger } from '@nestjs/common';
import RoomType, { checkRoomType } from '../auth/model/RoomType';
import { Socket } from 'socket.io';
import { PlayerEventRequest } from './model/PlayerEvents';
import { Queue } from './model/Queue';
import PlayerStatus from './model/PlayerStatus';

@Injectable()
export class PlayerEventsService {
  private readonly logger = new Logger(PlayerEventsService.name);

  public sendMobilePlayerEvent(client: Socket, playerRoomId: string, action: PlayerEventRequest) {
    checkRoomType(playerRoomId, RoomType.PLAYER);
    this.logger.log(`Send mobile event request for ${playerRoomId} ${action.eventId}`);
    client.to(playerRoomId).emit('receive-mobile-player-event', action);
    return true;
  }

  public sendDesktopPlayerEvent(client: Socket, playerRoomId: string, action: PlayerEventRequest) {
    checkRoomType(playerRoomId, RoomType.PLAYER);
    this.logger.log(`Send event request for ${playerRoomId} ${action.eventId}`);
    client.to(playerRoomId).emit('receive-player-event', action);
    return true;
  }

  public sendCompleteQueueRequest(client: Socket, playerRoomId: string, clientId: string) {
    checkRoomType(playerRoomId, RoomType.PLAYER);
    this.logger.log(`Send complete queue request for ${playerRoomId}`);
    client.to(playerRoomId).emit('receive-complete-queue-request', { clientId });
    return true;
  }

  public sendCompleteQueueResponse(client: Socket, clientId: string, queue: Queue) {
    this.logger.log(`Send complete queue  to ${clientId}`);
    client.to(clientId).emit('receive-complete-queue', { queue });
    return true;
  }

  public sendPlayerStatus(client: Socket, playerRoomId: string, status: PlayerStatus) {
    this.logger.log(`Send player status to player room: ${playerRoomId}`);
    client.to(playerRoomId).emit('receive-player-status', { status });
    return true;
  }
}
