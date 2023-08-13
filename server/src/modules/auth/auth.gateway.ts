import { Logger, OnModuleInit } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server as SocketServer, Socket } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import { AuthResponseDTO } from './dto/AuthResponseDTO';
import { AuthRequestDTO } from './dto/AuthRequestDTO';

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
    await client.join(authRoomId);
    this.logger.log(`${client.id} connected to auth room ${authRoomId}`);
    return true;
  }

  /**
   * Joins the player room inidicated by the playerRoomId
   *  @param playerRoomId
   */
  @SubscribeMessage('join-player-room')
  private async onJoinPlayerRoom(@ConnectedSocket() client: Socket, @MessageBody('playerRoomId') playerRoomId: string) {
    if (!playerRoomId || !playerRoomId.startsWith('player-')) {
      this.logger.warn(`${playerRoomId} is not a valid player room ID`);
      return false;
    }
    await client.join(playerRoomId);
    this.logger.log(`${client.id} connected to player room ${playerRoomId}`);

    return true;
  }

  /**
   * Sends an authorization request from a mobile client to the indicated authRoom
   * @param authRoomId
   */
  @SubscribeMessage('send-auth-request')
  private onSendAuthRequest(@ConnectedSocket() client: Socket, @MessageBody() request: AuthRequestDTO) {
    this.logger.log(`${client.id} sent auth request to auth room ${request.authRoomId}`);
    client.to(request.authRoomId).emit('receive-auth-request', {...request, clientId: client.id});
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
      this.logger.log(`${client.id} authorized request to join client ${body.clientId} to player room ${body.playerRoomId}`);
    }
    client.to(body.clientId).emit('receive-auth-response', body);
    return true;
  }
}
