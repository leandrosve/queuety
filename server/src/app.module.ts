import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { YoutubeModule } from './modules/youtube/youtube.module';
import { ConnectionModule } from './modules/connection/connection.module';

@Module({
  imports: [YoutubeModule, ConnectionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
