import { Module } from '@nestjs/common';
import { YoutubeModule } from './modules/youtube/youtube.module';
import { ConnectionModule } from './modules/connection/connection.module';
import { IOBasicModule } from './modules/io/basic/io.basic.module';

@Module({
  imports: [YoutubeModule, ConnectionModule, IOBasicModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
