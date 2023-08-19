import { Module } from '@nestjs/common';
import { YoutubeModule } from './modules/youtube/youtube.module';
import { ConnectionModule } from './modules/connection/connection.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppGateway } from './app.gateway';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerModule } from './modules/player/player.module';

@Module({
  imports: [YoutubeModule, ConnectionModule, AuthModule, PlayerModule],
  controllers: [AppController],
  providers: [AppGateway, AppService],
})
export class AppModule {}
