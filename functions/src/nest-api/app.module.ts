import {Module} from "@nestjs/common";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {StylecodeModule} from "./stylecode/stylecode.module";
import {TypeOrmModule} from "@nestjs/typeorm";

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
    }),
  ],
})

@Module({
  imports: [StylecodeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
