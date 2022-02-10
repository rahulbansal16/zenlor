import { Module } from '@nestjs/common';
import { LineitemsService } from './lineitems.service';
import { LineitemsController } from './lineitems.controller';

@Module({
  controllers: [LineitemsController],
  providers: [LineitemsService]
})
export class LineitemsModule {}
