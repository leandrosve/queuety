import { Logger, OnModuleInit, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server as SocketServer, Socket } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import { AuthResponseDTO } from './dto/AuthResponseDTO';
import { AuthRequestDTO } from './dto/AuthRequestDTO';
import { JoinPlayerRoomRequestDTO } from './dto/JoinPlayerRoomRequestDTO';

@WebSocketGateway(3333, { cors: { origin: ['http://localhost:5173', 'ws://admin.socket.io', 'http://192.168.0.226:5173'] } })
export class AuthGateway implements OnGatewayConnection {
  private readonly logger = new Logger(AuthGateway.name);

  @WebSocketServer()
  private server: SocketServer;

  constructor() {
    this.logger.log('Auth gateway started');
  }

  afterInit() {
    instrument(this.server, {
      auth: false,
      mode: 'development',
    });
  }

  public handleConnection(client: Socket) {
    this.logger.log(`A new device has connected - clientId: ${client.id}`);
    client.emit('connection', client.id);
    client.on('disconnecting', () => {
      this.handleDisconnecting(client);
    });
  }

  handleDisconnecting(client: Socket) {
    const isHost = client.data?.['host'];
    client.rooms.forEach((room) => {
      if (room.startsWith('player-')) {
        if (isHost) {
          client.to(room).emit('host-disconnected', true);
          return;
        }
        client.to(room).emit('user-disconnected', { userId: client.data?.['userId'] });
      }
      if (isHost && room.startsWith('auth-')) {
        client.to(room).emit('host-disconnected', true);
      }
    });
  }

  // First attempt to implement this
  // Beforehand Note: I definetely should have researched this more before starting to implement this

  /**
   * Joins the authentication room indicated by the authRoomId
   * @param authRoomId
   */
  @SubscribeMessage('join-auth-room')
  private async onJoinAuthRoom(@ConnectedSocket() client: Socket, @MessageBody('authRoomId') authRoomId: string) {
    if (!authRoomId || !authRoomId.startsWith('auth-')) {
      this.logger.warn(`${authRoomId} is not a valid auth room ID`);
      return false;
    }
    // Leave other auth rooms
    client.rooms.forEach((room) => room.startsWith('auth-') && client.leave(room));
    await client.join(authRoomId);
    this.logger.log(`${client.id} connected to auth room ${authRoomId}`);

    return true;
  }

  /**
   * Joins the player room inidicated by the playerRoomId
   *  @param playerRoomId
   */
  @SubscribeMessage('join-player-room')
  private async onJoinPlayerRoom(@ConnectedSocket() client: Socket, @MessageBody() body: JoinPlayerRoomRequestDTO) {
    const { playerRoomId, host, userId } = body;
    if (!playerRoomId || !playerRoomId.startsWith('player-')) {
      this.logger.warn(`${playerRoomId} is not a valid player room ID`);
      return false;
    }
    await client.join(playerRoomId);
    this.logger.log(`${client.id} joined player room ${playerRoomId}`);
    client.data = { ...client.data, host, userId };
    if (!host) {
      client.rooms.forEach((room) => room.startsWith('auth-') && client.leave(room));
    }
    this.notifyConnectionToRoom(client, playerRoomId);
    return true;
  }

  private notifyConnectionToRoom(client: Socket, roomId: string) {
    if (client.data['host']) {
      console.log('HOST RECONNECTED');
      client.to(roomId).emit('host-reconnected', true);
      return;
    }
    if (client.data['userId']) {
      client.to(roomId).emit('user-connected', { userId: client.data['userId'], clientId: client.id });
    }
  }

  private notifyUserReconnection(client: Socket, roomId: string) {
    if (client.data['userId']) {
      client.to(roomId).emit('user-reconnected', { userId: client.data['userId'], clientId: client.id });
    }
  }

  @SubscribeMessage('notify-user-reconnection')
  private async notifyUserConnection(@ConnectedSocket() client: Socket) {
    await client.rooms.forEach((room) => {
      if (room.startsWith('player-')) {
        console.log('user reconnection for room', room);
        this.notifyUserReconnection(client, room);
      }
    });
    return true;
  }

  /**
   * When a user joins a player room, the host should notify that it's online
   */
  @SubscribeMessage('notify-host-connection')
  private async notifyHostConnection(@ConnectedSocket() client: Socket, @MessageBody('clientId') clientId: string) {
    this.logger.log('che, le estoy mandando que me conecte al boludo de ' + clientId);
    await client.to(clientId).emit('host-connected', true);
    return true;
  }

  /**
   * Sends an authorization request from a mobile client to the indicated authRoom
   * @param authRoomId
   */
  @SubscribeMessage('send-auth-request')
  private async onSendAuthRequest(@ConnectedSocket() client: Socket, @MessageBody() request: AuthRequestDTO) {
    this.logger.log(`${client.id} sent auth request to auth room ${request.authRoomId}`);
    await client.to(request.authRoomId).emit('receive-auth-request', { ...request, clientId: client.id });
    return true;
  }

  /**
   * Sends the authorization response personally from the Desktop client to the indicated Mobile client
   * @param {AuthResponseDTO} body
   */
  @SubscribeMessage('send-auth-response')
  private onAuthResponse(@ConnectedSocket() client: Socket, @MessageBody() body: AuthResponseDTO) {
    if (body.status === 'DENIED') {
      this.logger.warn(`${client.id} denied auth request to join client ${body.clientId} to player room ${body.playerRoomId}`);
    } else if (body.status === 'AUTHORIZED') {
      this.logger.log(`${client.id} authorized request to join client ${body.clientId}`);
    }
    client.to(body.clientId).emit('receive-auth-response', body);
    return true;
  }
}
