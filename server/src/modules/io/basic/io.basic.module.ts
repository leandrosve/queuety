import { Module } from '@nestjs/common';
import { IOBasicGateway } from './io.basic.gateway';

@Module({
  providers: [IOBasicGateway],
})
export class IOBasicModule {}
