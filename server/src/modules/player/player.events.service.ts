import { Injectable, Logger } from '@nestjs/common';
import RoomType, { checkRoomType } from '../auth/model/RoomType';
import { Socket } from 'socket.io';
import { PlayerEventRequest } from './model/PlayerEvents';
import { Queue } from './model/Queue';

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

  public sendCompletePlayerStatusRequest(client: Socket, playerRoomId: string, clientId: string) {
    checkRoomType(playerRoomId, RoomType.PLAYER);
    this.logger.log(`Send complete player action request for ${playerRoomId}`);
    client.to(playerRoomId).emit('receive-complete-player-status-request', { clientId });
    return true;
  }

  public sendCompletePlayerStatusResponse(client: Socket, clientId: string, queue: Queue) {
    this.logger.log(`Send complete player status response to ${clientId}`);
    client.to(clientId).emit('receive-complete-player-status', { queue });
    return true;
  }
}
