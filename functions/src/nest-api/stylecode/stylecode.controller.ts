import {Controller, Get, Post, Body, Patch, Param, Delete} from "@nestjs/common";
import {StylecodeService} from "./stylecode.service";
import {CreateStylecodeDto} from "./dto/create-stylecode.dto";
import {UpdateStylecodeDto} from "./dto/update-stylecode.dto";

@Controller("stylecode")
export class StylecodeController {
  constructor(private readonly stylecodeService: StylecodeService) {}

  @Post()
  create(@Body() createStylecodeDto: CreateStylecodeDto) {
    return this.stylecodeService.create(createStylecodeDto);
  }

  @Get()
  findAll() {
    return this.stylecodeService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.stylecodeService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateStylecodeDto: UpdateStylecodeDto) {
    return this.stylecodeService.update(+id, updateStylecodeDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.stylecodeService.remove(+id);
  }
}
