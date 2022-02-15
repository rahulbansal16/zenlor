import { Test, TestingModule } from '@nestjs/testing';
import { BomsService } from './boms.service';

describe('BomsService', () => {
  let service: BomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BomsService],
    }).compile();

    service = module.get<BomsService>(BomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
