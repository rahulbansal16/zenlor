import {Module} from "@nestjs/common";
import {StylecodeService} from "./stylecode.service";
import {StylecodeController} from "./stylecode.controller";

@Module({
  controllers: [StylecodeController],
  providers: [StylecodeService],
})
export class StylecodeModule {}
