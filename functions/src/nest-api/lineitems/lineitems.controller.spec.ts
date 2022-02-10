import { Test, TestingModule } from '@nestjs/testing';
import { LineitemsController } from './lineitems.controller';
import { LineitemsService } from './lineitems.service';

describe('LineitemsController', () => {
  let controller: LineitemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LineitemsController],
      providers: [LineitemsService],
    }).compile();

    controller = module.get<LineitemsController>(LineitemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
