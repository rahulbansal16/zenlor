import { Test, TestingModule } from '@nestjs/testing';
import { BomsController } from './boms.controller';
import { BomsService } from './boms.service';

describe('BomsController', () => {
  let controller: BomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BomsController],
      providers: [BomsService],
    }).compile();

    controller = module.get<BomsController>(BomsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
