import {Test, TestingModule} from "@nestjs/testing";
import {StylecodeService} from "./stylecode.service";

describe("StylecodeService", () => {
  let service: StylecodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StylecodeService],
    }).compile();

    service = module.get<StylecodeService>(StylecodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
