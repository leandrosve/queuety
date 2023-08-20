import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { BadRequestExceptionFilter } from 'src/common/filters/BadRequestExceptionFilter';
import { QueueActionRequest } from './model/QueueActions';
import { PlayerEventsService } from './player.events.service';

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

  @SubscribeMessage('send-player-action')
  private async sendAction(@ConnectedSocket() client: Socket, @MessageBody() dto: { playerRoomId: string; action: QueueActionRequest }) {
    this.playerEventsService.sendPlayerAction(client, dto.playerRoomId, dto.action);
    return true;
  }
}
