import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketServer, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { BadRequestExceptionFilter } from 'src/common/filters/BadRequestExceptionFilter';
import { Server as SocketServer } from 'socket.io';

@UsePipes(new ValidationPipe({ transform: true }))
@UseFilters(BadRequestExceptionFilter)
@WebSocketGateway({ namespace: '/player', cors: { origin: ['http://localhost:5173', 'ws://admin.socket.io', 'http://192.168.0.226:5173'] } })
export class PlayerGateway {
  @SubscribeMessage('test')
  private async testValidation(@ConnectedSocket() client: Socket, @MessageBody() dto: any) {
    return { dto, wtf: true };
  }
}
