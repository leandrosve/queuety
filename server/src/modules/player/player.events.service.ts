import { Injectable, Logger } from '@nestjs/common';
import RoomType, { checkRoomType } from '../auth/model/RoomType';
import { Socket } from 'socket.io';
import { InitializeEvent, PlayerEventRequest } from './model/PlayerEvents';
import { Queue } from './model/Queue';
import PlayerStatus from './model/PlayerStatus';
import { PlayerStatusAction } from './model/PlayerStatusAction';

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

  public sendCompleteQueueResponse(client: Socket, clientId: string, action: InitializeEvent) {
    this.logger.log(`Send complete queue  to ${clientId}`, action);
    client.to(clientId).emit('receive-complete-queue', action);
    return true;
  }

  public sendPlayerStatus(client: Socket, playerRoomId: string, timestamp: number, status: PlayerStatus) {
    this.logger.log(`Send player status to player room: ${playerRoomId}`);
    client.to(playerRoomId).emit('receive-player-status', { timestamp, status });
    return true;
  }

  public sendMobilePlayerStatusAction(client: Socket, playerRoomId: string, action: PlayerStatusAction) {
    this.logger.log(`Send player status request to player room: ${playerRoomId}`);
    client.to(playerRoomId).emit('receive-player-status-action', action);
    return true;
  }

  public sendSessionEnded(client: Socket, playerRoomId: string) {
    client.to(playerRoomId).emit('receive-session-ended');
    return true;
  }
}
