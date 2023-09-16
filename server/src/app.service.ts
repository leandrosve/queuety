import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return { status: 'online' };
  }
}
