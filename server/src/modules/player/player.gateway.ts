import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketServer, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { BadRequestExceptionFilter } from 'src/common/filters/BadRequestExceptionFilter';
import { Server as SocketServer } from 'socket.io';
import { QueueActionRequest } from './model/QueueActions';
import { PlayerService } from './player.service';
import { JoinPlayerRoomRequestDTO } from '../auth/dto/JoinPlayerRoomRequestDTO';

@UsePipes(new ValidationPipe({ transform: true }))
@UseFilters(BadRequestExceptionFilter)
@WebSocketGateway({ namespace: '/player', cors: { origin: ['http://localhost:5173', 'ws://admin.socket.io', 'http://192.168.0.226:5173'] } })
export class PlayerGateway implements OnGatewayConnection {
  private readonly logger = new Logger(PlayerGateway.name);

  constructor(private readonly playerService: PlayerService) {
    this.logger.log('Player gateway started');
  }

  handleConnection(client: any) {
    this.playerService.onConnection(client);
  }

  @SubscribeMessage('test')
  private async test(@ConnectedSocket() client: Socket, @MessageBody() dto: any) {
    return { dto, wtf: true };
  }

  @SubscribeMessage('join-player-room')
  private async onJoinPlayerRoom(@ConnectedSocket() client: Socket, @MessageBody() dto: JoinPlayerRoomRequestDTO) {
    return this.playerService.joinPlayerRoom(client, dto);
  }

  @SubscribeMessage('send-player-action')
  private async sendAction(@ConnectedSocket() client: Socket, @MessageBody() dto: { playerRoomId: string; action: QueueActionRequest }) {
    this.playerService.sendPlayerAction(client, dto.playerRoomId, dto.action);
  }
}
