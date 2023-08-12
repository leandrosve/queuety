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

  // Example
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

  // First attempt to implement this
  // Beforehand Note: I definetely should have researched this more before starting to implement this
  @SubscribeMessage('join-auth-room')
  private onJoinAuthRoom(@ConnectedSocket() client: Socket, @MessageBody('authRoomId') authRoomId: string) {
    if (!authRoomId || !authRoomId.startsWith('auth-')) {
      this.logger.warn(`${authRoomId} is not a valid auth room ID`);
      return false;
    }
    client.join(authRoomId);
    this.logger.log(`${client.id} connected to auth room ${authRoomId}`);
    return true;
  }

  @SubscribeMessage('send-auth-request')
  private onSendAuthRequest(@ConnectedSocket() client: Socket, @MessageBody('authRoomId') authRoomId: string) {
    this.logger.log(`${client.id} sent auth request to auth room ${authRoomId}`);

    client.to(authRoomId).emit('receive-auth-request', { clientId: client.id });
    return true;
  }

  @SubscribeMessage('send-auth-confirmation')
  private onAuthConfirmation(
    @ConnectedSocket() client: Socket,
    @MessageBody('clientId') clientId: string,
    @MessageBody('playerRoomId') playerRoomId: string,
    @MessageBody('accepted') accepted: boolean
  ) {
    this.logger.log(`${client.id} confirmed auth request to player room ${playerRoomId}`);

    client.to(clientId).emit('receive-auth-confirmation', { playerRoomId, accepted });
    return true;
  }

  @SubscribeMessage('join-player-room')
  private onJoinPlayerRoom(@ConnectedSocket() client: Socket, @MessageBody('playerRoomId') playerRoomId: string) {
    if (!playerRoomId || !playerRoomId.startsWith('player-')) {
      this.logger.warn(`${playerRoomId} is not a valid player room ID`);
      return false;
    }
    client.join(playerRoomId);
    this.logger.log(`${client.id} connected to player room ${playerRoomId}`);

    return true;
  }
}
