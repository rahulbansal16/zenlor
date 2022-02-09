import {Test, TestingModule} from "@nestjs/testing";
import {StylecodeController} from "./stylecode.controller";
import {StylecodeService} from "./stylecode.service";

describe("StylecodeController", () => {
  let controller: StylecodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StylecodeController],
      providers: [StylecodeService],
    }).compile();

    controller = module.get<StylecodeController>(StylecodeController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
