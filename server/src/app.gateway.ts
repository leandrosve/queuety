import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { instrument } from '@socket.io/admin-ui';
import { Server as SocketServer } from 'socket.io';

@WebSocketGateway({ cors: { origin: ['http://localhost:5173', 'ws://admin.socket.io', 'http://192.168.0.226:5173'] } })
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
