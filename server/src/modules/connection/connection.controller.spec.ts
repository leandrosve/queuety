import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionController } from './connection.controller';
import { ConnectionService } from './connection.service';

describe('ConnectionController', () => {
  let connectionController: ConnectionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ConnectionController],
      providers: [ConnectionService],
    }).compile();

    connectionController = app.get<ConnectionController>(ConnectionController);
  });
});
