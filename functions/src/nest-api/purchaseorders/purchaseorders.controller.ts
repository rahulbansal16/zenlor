import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { PurchaseordersService } from './purchaseorders.service';
import { CreatePurchaseorderDto } from './dto/create-purchaseorder.dto';
import { UpdatePurchaseorderDto } from './dto/update-purchaseorder.dto';

@Controller('purchaseorders')
export class PurchaseordersController {
  constructor(private readonly purchaseordersService: PurchaseordersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createPurchaseorderDto: CreatePurchaseorderDto) {
    return this.purchaseordersService.create(createPurchaseorderDto);
  }

  @Get()
  findAll() {
    return this.purchaseordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurchaseorderDto: UpdatePurchaseorderDto) {
    return this.purchaseordersService.update(+id, updatePurchaseorderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseordersService.remove(+id);
  }
}
