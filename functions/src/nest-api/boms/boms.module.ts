import { Module } from '@nestjs/common';
import { BomsService } from './boms.service';
import { BomsController } from './boms.controller';

@Module({
  controllers: [BomsController],
  providers: [BomsService]
})
export class BomsModule {}
