import {Injectable} from "@nestjs/common";
import {CreateStylecodeDto} from "./dto/create-stylecode.dto";
import {UpdateStylecodeDto} from "./dto/update-stylecode.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Stylecode} from "./entities/stylecode.entity";
import { Repository } from 'typeorm';

@Injectable()
export class StylecodeService {
  constructor(
    @InjectRepository(Stylecode)
    private styleCodeRepository: Repository<Stylecode>,
  ) {}

  create(createStylecodeDto: CreateStylecodeDto) {
    return this.styleCodeRepository.save(createStylecodeDto)
  }

  findAll() {
    return this.styleCodeRepository.find();
    return `This action returns all stylecode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stylecode`;
  }

  update(id: number, updateStylecodeDto: UpdateStylecodeDto) {
    return `This action updates a #${id} stylecode`;
  }

  remove(id: number) {
    return `This action removes a #${id} stylecode`;
  }
}
