import { Injectable } from '@nestjs/common';
import { CreateBomDto } from './dto/create-bom.dto';
import { UpdateBomDto } from './dto/update-bom.dto';

@Injectable()
export class BomsService {
  create(createBomDto: CreateBomDto) {
    return 'This action adds a new bom';
  }

  findAll() {
    return `This action returns all boms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bom`;
  }

  update(id: number, updateBomDto: UpdateBomDto) {
    return `This action updates a #${id} bom`;
  }

  remove(id: number) {
    return `This action removes a #${id} bom`;
  }
}
