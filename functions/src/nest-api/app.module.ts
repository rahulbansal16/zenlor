import {Module} from "@nestjs/common";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
// import {StylecodeModule} from "./stylecode/stylecode.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import { Stylecode } from "./stylecode/entities/stylecode.entity";
import { StylecodeService } from "./stylecode/stylecode.service";
import { StylecodeController } from "./stylecode/stylecode.controller";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      // host: '/cloudsql/zenlor:asia-south1:zenlormysqldb',
      host: "34.93.47.89",
      port: 3306,
      username: "root",
      password: "uCyiD8H2u2l8OACw",
      database: "staging",
      entities: ["lib/**/*.entity{.ts,.js}"],
      synchronize: true
    }),
    TypeOrmModule.forFeature([
      Stylecode
    ])
  ],
})

@Module({
  controllers: [AppController, StylecodeController],
  providers: [AppService, StylecodeService],
})
export class AppModule {}
