import { PartialType } from '@nestjs/mapped-types';
import { CreateLineitemDto } from './create-lineitem.dto';

export class UpdateLineitemDto extends PartialType(CreateLineitemDto) {}
