import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseordersController } from './purchaseorders.controller';
import { PurchaseordersService } from './purchaseorders.service';

describe('PurchaseordersController', () => {
  let controller: PurchaseordersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseordersController],
      providers: [PurchaseordersService],
    }).compile();

    controller = module.get<PurchaseordersController>(PurchaseordersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
