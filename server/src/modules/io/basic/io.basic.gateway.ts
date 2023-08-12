import { Logger, OnModuleInit } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server as SocketServer, Socket } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';

@WebSocketGateway(3333, { cors: { origin: ['http://localhost:5173', 'ws://admin.socket.io'] } })
export class IOBasicGateway implements OnGatewayConnection {
  private readonly logger = new Logger(IOBasicGateway.name);

  @WebSocketServer()
  private server: SocketServer;

  constructor() {
    this.logger.log('Gateway started');
  }

  afterInit() {
    instrument(this.server, {
      auth: false,
      mode: 'development',
    });
  }

  public handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`A new device has connected - client: ${client.id},  - args: ${args}`);
    client.emit('connection', client.id);
  }

  @SubscribeMessage('send-message')
  private onSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody('message') message: string,
    @MessageBody('room') room: string,
    @MessageBody('user') user: string
  ) {
    this.logger.log(`Event received - clientId: ${client.id} - message: ${message} - for room: ${room} - user: ${user}`);
    if (!room) return false;
    client.broadcast.to(room).emit('message-received', { message });
    return true;
  }

  @SubscribeMessage('join-room')
  private onJoinRoom(@ConnectedSocket() client: Socket, @MessageBody('room') room: string) {
    // Leave all rooms and join new one
    client.rooms.forEach((r) => {
      if (r !== client.id) client.leave(r);
    });
    client.join(room);
    return true;
  }
}
