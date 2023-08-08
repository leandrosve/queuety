import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { YoutubeModule } from './modules/youtube/youtube.module';

@Module({
  imports: [YoutubeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
