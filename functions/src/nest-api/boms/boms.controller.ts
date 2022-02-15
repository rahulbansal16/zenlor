import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BomsService } from './boms.service';
import { CreateBomDto } from './dto/create-bom.dto';
import { UpdateBomDto } from './dto/update-bom.dto';

@Controller('boms')
export class BomsController {
  constructor(private readonly bomsService: BomsService) {}

  @Post()
  create(@Body() createBomDto: CreateBomDto) {
    return this.bomsService.create(createBomDto);
  }

  @Get()
  findAll() {
    return this.bomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bomsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBomDto: UpdateBomDto) {
    return this.bomsService.update(+id, updateBomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bomsService.remove(+id);
  }
}
