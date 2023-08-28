import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { BadRequestExceptionFilter } from 'src/common/filters/BadRequestExceptionFilter';
import { PlayerConnectionService } from './player.connection.service';
import { JoinPlayerRoomRequestDTO } from '../auth/dto/JoinPlayerRoomRequestDTO';
import { UserChangeDTO } from '../auth/dto/UserChangeDTO';

@UsePipes(new ValidationPipe({ transform: true }))
@UseFilters(BadRequestExceptionFilter)
@WebSocketGateway({ namespace: '/player', cors: { origin: ['http://localhost:5173', 'ws://admin.socket.io', 'http://192.168.0.226:5173'] } })
export class PlayerConnectionGateway implements OnGatewayConnection {
  private readonly logger = new Logger(PlayerConnectionService.name);

  constructor(private readonly playerConnectionService: PlayerConnectionService) {
    this.logger.log('Player gateway started');
  }

  handleConnection(client: any) {
    this.playerConnectionService.onConnection(client);
  }

  @SubscribeMessage('test-connection')
  private onTestConnection(@ConnectedSocket() client: Socket) {
    return true;
  }

  @SubscribeMessage('join-player-room')
  private async onJoinPlayerRoom(@ConnectedSocket() client: Socket, @MessageBody() dto: JoinPlayerRoomRequestDTO) {
    return this.playerConnectionService.joinPlayerRoom(client, dto);
  }

  @SubscribeMessage('notify-user-reconnection')
  private async onNotifyUserConnection(
    @ConnectedSocket() client: Socket,
    @MessageBody('playerRoomId') playerRoomId: string,
    @MessageBody('nickname') nickname: string
  ) {
    return this.playerConnectionService.notifyUserConnection(client, playerRoomId, nickname);
  }

  @SubscribeMessage('notify-user-changed')
  private onSendUserChanged(@ConnectedSocket() client: Socket, @MessageBody() dto: UserChangeDTO) {
    return this.playerConnectionService.sendUserChanged(client, dto);
  }

  @SubscribeMessage('notify-host-connection')
  private async onNotifyHostConnection(
    @ConnectedSocket() client: Socket,
    @MessageBody('clientId') clientId: string,
    @MessageBody('nickname') hostNickname: string,
    @MessageBody('userId') hostUserId: string,

  ) {
    return this.playerConnectionService.notifyHostConnection(client, clientId, hostNickname, hostUserId);
  }

  @SubscribeMessage('notify-auth-revocation')
  private onSendAuthRevocation(@ConnectedSocket() client: Socket, @MessageBody('clientId') clientId: string) {
    client.to(clientId).emit('receive-auth-revocation', clientId);
    return true;
  }
}
