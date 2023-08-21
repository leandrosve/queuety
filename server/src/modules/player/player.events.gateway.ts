import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { BadRequestExceptionFilter } from 'src/common/filters/BadRequestExceptionFilter';
import { PlayerEventRequest } from './model/PlayerEvents';
import { PlayerEventsService } from './player.events.service';
import { Queue } from './model/Queue';

@UsePipes(new ValidationPipe({ transform: true }))
@UseFilters(BadRequestExceptionFilter)
@WebSocketGateway({ namespace: '/player', cors: { origin: ['http://localhost:5173', 'ws://admin.socket.io', 'http://192.168.0.226:5173'] } })
export class PlayerEventsGateway {
  private readonly logger = new Logger(PlayerEventsGateway.name);

  constructor(private readonly playerEventsService: PlayerEventsService) {
    this.logger.log('Player gateway started');
  }

  @SubscribeMessage('test-events')
  private onTestConnection(@ConnectedSocket() client: Socket) {
    return true;
  }

  @SubscribeMessage('send-complete-player-status-request')
  private async onSendCompletePlayerStatusRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody('playerRoomId') playerRoomId: string,
    @MessageBody('clientId') clientId: string
  ) {
    this.playerEventsService.sendCompletePlayerStatusRequest(client, playerRoomId, clientId);
    return true;
  }

  @SubscribeMessage('send-mobile-player-action')
  private async onSendMobilePlayerAction(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: { playerRoomId: string; action: PlayerEventRequest }
  ) {
    this.playerEventsService.sendMobilePlayerEvent(client, dto.playerRoomId, dto.action);
    return true;
  }

  @SubscribeMessage('send-player-event')
  private async onSendEvent(@ConnectedSocket() client: Socket, @MessageBody() dto: { playerRoomId: string; action: PlayerEventRequest }) {
    this.playerEventsService.sendDesktopPlayerEvent(client, dto.playerRoomId, dto.action);
    return true;
  }

  @SubscribeMessage('send-complete-player-status')
  private async onSendCompletePlayerStatusResponse(@ConnectedSocket() client: Socket, @MessageBody() dto: { clientId: string; queue: Queue }) {
    this.playerEventsService.sendCompletePlayerStatusResponse(client, dto.clientId, dto.queue);
    return true;
  }
}
