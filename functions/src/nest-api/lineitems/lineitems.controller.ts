import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LineitemsService } from './lineitems.service';
import { CreateLineitemDto } from './dto/create-lineitem.dto';
import { UpdateLineitemDto } from './dto/update-lineitem.dto';

@Controller('lineitems')
export class LineitemsController {
  constructor(private readonly lineitemsService: LineitemsService) {}

  @Post()
  create(@Body() createLineitemDto: CreateLineitemDto) {
    return this.lineitemsService.create(createLineitemDto);
  }

  @Get()
  findAll() {
    return this.lineitemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lineitemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLineitemDto: UpdateLineitemDto) {
    return this.lineitemsService.update(+id, updateLineitemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lineitemsService.remove(+id);
  }
}
