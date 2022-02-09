import {PartialType} from "@nestjs/mapped-types";
import {CreateStylecodeDto} from "./create-stylecode.dto";

export class UpdateStylecodeDto extends PartialType(CreateStylecodeDto) {}
