import { Module } from '@nestjs/common';
import { PurchaseordersService } from './purchaseorders.service';
import { PurchaseordersController } from './purchaseorders.controller';

@Module({
  controllers: [PurchaseordersController],
  providers: [PurchaseordersService]
})
export class PurchaseordersModule {}
