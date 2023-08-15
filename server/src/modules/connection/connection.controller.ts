import { Controller, Get, Post } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Connection')
@Controller('connection')
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Post('/player')
  getPlayerRoomId() {
    return this.connectionService.getPlayerRoomId();
  }

  @Post('/auth')
  getAuthRoomId() {
    return this.connectionService.getAuthRoomId();
  }

  @Post('/user')
  getUserId() {
    return this.connectionService.getUserId();
  }
}
