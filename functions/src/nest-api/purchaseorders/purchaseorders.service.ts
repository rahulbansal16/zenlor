import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePurchaseorderDto } from './dto/create-purchaseorder.dto';
import { UpdatePurchaseorderDto } from './dto/update-purchaseorder.dto';
import { Purchaseorder } from './entities/purchaseorder.entity';

@Injectable()
export class PurchaseordersService {

  constructor(
    @InjectRepository(Purchaseorder)
    private purchaseOrderRepository: Repository<Purchaseorder>
  ){}

  create(createPurchaseorderDto: CreatePurchaseorderDto) {
    return this.purchaseOrderRepository.save(createPurchaseorderDto)
  }

  findAll() {
    return `This action returns all purchaseorders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchaseorder`;
  }

  update(id: number, updatePurchaseorderDto: UpdatePurchaseorderDto) {
    return `This action updates a #${id} purchaseorder`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchaseorder`;
  }
}
