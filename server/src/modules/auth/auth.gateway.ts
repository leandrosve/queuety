import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketServer, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthResponseDTO } from './dto/AuthResponseDTO';
import { AuthRequestDTO } from './dto/AuthRequestDTO';
import { JoinPlayerRoomRequestDTO } from './dto/JoinPlayerRoomRequestDTO';
import { AuthService } from './auth.service';
import { BadRequestExceptionFilter } from 'src/common/filters/BadRequestExceptionFilter';
import { Server as SocketServer } from 'socket.io';

@UsePipes(new ValidationPipe({ transform: true }))
@UseFilters(BadRequestExceptionFilter)
@WebSocketGateway({ namespace: '/auth', cors: { origin: ['http://localhost:5173', 'ws://admin.socket.io', 'http://192.168.0.226:5173'] } })
export class AuthGateway implements OnGatewayConnection {
  private readonly logger = new Logger(AuthGateway.name);

  constructor(private readonly authService: AuthService) {
    this.logger.log('Auth gateway started');
  }

  public handleConnection(client: Socket) {
    this.authService.onConnect(client);
  }

  // First attempt to implement this
  // Beforehand Note: I definetely should have researched this more before starting to implement this

  @SubscribeMessage('test-validation')
  private async testValidation(@ConnectedSocket() client: Socket, @MessageBody() dto: JoinPlayerRoomRequestDTO) {
    return { dto, wtf: true };
  }

  @SubscribeMessage('join-auth-room')
  private async onJoinAuthRoom(@ConnectedSocket() client: Socket, @MessageBody('authRoomId') authRoomId: string) {
    return this.authService.joinAuthRoom(client, authRoomId);
  }

  @SubscribeMessage('join-player-room')
  private async onJoinPlayerRoom(@ConnectedSocket() client: Socket, @MessageBody() dto: JoinPlayerRoomRequestDTO) {
    return this.authService.joinPlayerRoom(client, dto);
  }

  @SubscribeMessage('notify-user-reconnection')
  private async onNotifyUserConnection(@ConnectedSocket() client: Socket) {
    return this.authService.notifyUserConnection(client);
  }

  @SubscribeMessage('notify-host-connection')
  private async onNotifyHostConnection(@ConnectedSocket() client: Socket, @MessageBody('clientId') clientId: string) {
    return this.authService.notifyHostConnection(client, clientId);
  }

  @SubscribeMessage('send-auth-request')
  private async onSendAuthRequest(@ConnectedSocket() client: Socket, @MessageBody() dto: AuthRequestDTO) {
    await client.to(dto.authRoomId).emit('receive-auth-request', { ...dto, clientId: client.id });
    this.logger.log(`${client.id} sent auth request to auth room ${dto.authRoomId}`);
    return true;
  }

  @SubscribeMessage('send-auth-response')
  private onSendAuthResponse(@ConnectedSocket() client: Socket, @MessageBody() dto: AuthResponseDTO) {
    return this.authService.sendAuthResponse(client, dto);
  }

  @SubscribeMessage('send-auth-revocation')
  private onSendAuthRevocation(@ConnectedSocket() client: Socket, @MessageBody('clientId') clientId: string) {
    return this.authService.sendAuthRevocation(client, clientId);
  }
}
