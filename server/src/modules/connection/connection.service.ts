import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class ConnectionService {
  private seed: string;

  constructor() {
    this.seed = process.env.CONNECTION_CODE_SEED || createHash('md5').digest('hex');
  }

  getSessionCode() {
    const code = createHash('sha256').update(`${this.seed}${new Date().getTime()}`).digest('hex');
    return { code };
  }
}
