import { Test, TestingModule } from '@nestjs/testing';
import { LineitemsService } from './lineitems.service';

describe('LineitemsService', () => {
  let service: LineitemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LineitemsService],
    }).compile();

    service = module.get<LineitemsService>(LineitemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
