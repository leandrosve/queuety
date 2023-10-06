import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthResponseDTO } from './dto/AuthResponseDTO';
import { AuthRequestDTO } from './dto/AuthRequestDTO';
import { AuthService } from './auth.service';
import { BadRequestExceptionFilter } from 'src/common/filters/BadRequestExceptionFilter';
import { JoinAuthRoomRequestDTO } from './dto/JoinAuthRoomRequestDTO';
import allowedOrigins from 'src/config/allowedOrigins';

@UsePipes(new ValidationPipe({ transform: true }))
@UseFilters(BadRequestExceptionFilter)
@WebSocketGateway({ namespace: '/auth', cors: { origin: [...allowedOrigins, 'ws://admin.socket.io'] } })
export class AuthGateway implements OnGatewayConnection {
  private readonly logger = new Logger(AuthGateway.name);

  constructor(private readonly authService: AuthService) {
    this.logger.log('Auth gateway started');
  }

  public handleConnection(client: Socket) {
    this.logger.log('Client connected: ' + client.id);
    this.authService.onConnect(client);
  }

  @SubscribeMessage('join-auth-room')
  private async onJoinAuthRoom(@ConnectedSocket() client: Socket, @MessageBody() dto: JoinAuthRoomRequestDTO) {
    return this.authService.joinAuthRoom(client, dto);
  }

  @SubscribeMessage('leave-auth-room')
  private async leaveAuthRoom(@ConnectedSocket() client: Socket, @MessageBody('authRoomId') authRoomId: string) {
    return this.authService.leaveAuthRoom(client, authRoomId);
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
