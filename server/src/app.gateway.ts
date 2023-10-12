import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { instrument } from '@socket.io/admin-ui';
import { Server as SocketServer } from 'socket.io';
import { Logger } from '@nestjs/common';
import getAllowedOrigins from './config/allowedOrigins';

interface BasicAuthentication {
  type: 'basic';
  username: string;
  password: string;
}

@WebSocketGateway({ cors: { origin: [...getAllowedOrigins(), 'ws://admin.socket.io', 'https://admin.socket.io'] } })
export class AppGateway {
  @WebSocketServer()
  private server: SocketServer;

  private readonly logger = new Logger(AppGateway.name);

  afterInit() {
    let auth = process.env.USE_SOCKET_ADMIN_AUTH === 'true';
    if (!auth) {
      this.logger.warn('Socket Admin started without credentials');
      instrument(this.server, { auth: false });
      return;
    }
    const username = process.env.SOCKET_ADMIN_USERNAME;
    const password = process.env.SOCKET_ADMIN_PASSWORD;
    if (!username || !password) {
      this.logger.error('Socket Admin Credentials were not provided.');
      return;
    }
    const credentials: BasicAuthentication = { type: 'basic', username, password };
    this.logger.log('Socket Admin started with credentials');
    instrument(this.server, { auth: credentials });
    return;
  }
}
