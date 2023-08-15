import { Injectable } from '@nestjs/common';
import { createHash, sign, createSign } from 'crypto';

@Injectable()
export class ConnectionService {
  private seed: string;

  constructor() {
    this.seed = process.env.CONNECTION_CODE_SEED || createHash('md5').digest('hex');
  }

  /**
   * Generates a unique code that represents the room where the player sync will occur
   */
  getPlayerRoomId() {
    const roomId = 'player-' + createHash('sha256').update(`${this.seed}${new Date().getTime()}`).digest('hex');
    return { roomId };
  }

  /**
   * Generates a unique code that represents the room where the handshake prior to the player sync occurs
   */
  getAuthRoomId() {
    const roomId = 'auth-' + createHash('md5').update(`${this.seed}${new Date().getTime()}`).digest('hex');
    return { roomId };
  }

  /**
   * Generates a unique user id
   */
  getUserId() {
    const userId = 'user-' + createHash('sha256').update(`${this.seed}${new Date().getTime()}`).digest('hex');
    return { userId };
  }
}
