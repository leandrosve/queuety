import { Module } from '@nestjs/common';
import { YoutubeModule } from './modules/youtube/youtube.module';
import { ConnectionModule } from './modules/connection/connection.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [YoutubeModule, ConnectionModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
