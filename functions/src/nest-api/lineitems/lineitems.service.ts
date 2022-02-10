import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLineitemDto } from './dto/create-lineitem.dto';
import { UpdateLineitemDto } from './dto/update-lineitem.dto';
import { Lineitem } from './entities/lineitem.entity';

@Injectable()
export class LineitemsService {

  constructor(
    @InjectRepository(Lineitem)
    private lineItemRepository: Repository<Lineitem>
  ){

  }
  create(createLineitemDto: CreateLineitemDto) {
    return this.lineItemRepository.save(createLineitemDto);
    return 'This action adds a new lineitem';
  }

  findAll() {
    return `This action returns all lineitems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lineitem`;
  }

  update(id: number, updateLineitemDto: UpdateLineitemDto) {
    return `This action updates a #${id} lineitem`;
  }

  remove(id: number) {
    return `This action removes a #${id} lineitem`;
  }
}
