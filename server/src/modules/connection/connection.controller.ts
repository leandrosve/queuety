import { Controller, Get } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Connection')
@Controller('connection')
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Get('/code')
  getSessionCode() {
    return this.connectionService.getSessionCode();
  }
}
