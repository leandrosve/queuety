import { Module } from '@nestjs/common';
import { YoutubeModule } from './modules/youtube/youtube.module';
import { ConnectionModule } from './modules/connection/connection.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppGateway } from './app.gateway';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [YoutubeModule, ConnectionModule, AuthModule],
  controllers: [AppController],
  providers: [AppGateway, AppService],
})
export class AppModule {}
