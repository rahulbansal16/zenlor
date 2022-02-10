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
    return this.styleCodeRepository.find({
      where: {
        isDeleted: 0
      }
    });
  }

  findOne(id: number) {
    return this.styleCodeRepository.findOne({
      where: {
        id,
        isDeleted: 0
      }
    });
  }

  update(id: number, updateStylecodeDto: UpdateStylecodeDto) {
    return this.styleCodeRepository.update(id, updateStylecodeDto)
  }

  remove(id: number) {
    return this.styleCodeRepository.update({
      id
    },{
      isDeleted: 1
    })
  }

}
