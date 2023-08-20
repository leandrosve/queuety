import { Module } from '@nestjs/common';
import { PlayerEventsGateway } from './player.events.gateway';
import { PlayerConnectionService } from './player.connection.service';
import { PlayerEventsService } from './player.events.service';
import { PlayerConnectionGateway } from './player.connection.gateway';

@Module({
  providers: [PlayerEventsGateway, PlayerConnectionGateway, PlayerEventsService, PlayerConnectionService],
})
export class PlayerModule {}
