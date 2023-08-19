import { Module } from '@nestjs/common';
import { PlayerGateway } from './player.gateway';
import { PlayerService } from './player.service';

@Module({
  providers: [PlayerGateway, PlayerService],
})
export class PlayerModule {}
