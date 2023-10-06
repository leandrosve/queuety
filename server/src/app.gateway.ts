import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { instrument } from '@socket.io/admin-ui';
import { Server as SocketServer } from 'socket.io';
import allowedOrigins from './config/allowedOrigins';

@WebSocketGateway({ cors: { origin: [...allowedOrigins, 'ws://admin.socket.io', 'https://admin.socket.io'] } })
export class AppGateway {
  @WebSocketServer()
  private server: SocketServer;
  afterInit() {
    // @ts-ignore
    instrument(this.server, {
      auth: false,
    });
  }
}
