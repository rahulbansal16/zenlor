import {Module} from "@nestjs/common";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
// import {StylecodeModule} from "./stylecode/stylecode.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import { Stylecode } from "./stylecode/entities/stylecode.entity";
import { StylecodeService } from "./stylecode/stylecode.service";
import { StylecodeController } from "./stylecode/stylecode.controller";
import { Purchaseorder } from "./purchaseorders/entities/purchaseorder.entity";
import { PurchaseordersController } from "./purchaseorders/purchaseorders.controller";
import { PurchaseordersService } from "./purchaseorders/purchaseorders.service";
import { Supplier } from "./suppliers/entities/supplier.entity";
import { SuppliersController } from "./suppliers/suppliers.controller";
import { SuppliersService } from "./suppliers/suppliers.service";
import { Lineitem } from "./lineitems/entities/lineitem.entity";
import { LineitemsController } from "./lineitems/lineitems.controller";
import { LineitemsService } from "./lineitems/lineitems.service";

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
      Stylecode,
      Purchaseorder,
      Supplier,
      Lineitem
    ]),
    // PurchaseordersModule,
    // SuppliersModule
  ],
})

@Module({
  controllers: [AppController, StylecodeController, PurchaseordersController, SuppliersController, LineitemsController],
  providers: [AppService, StylecodeService, PurchaseordersService, SuppliersService, LineitemsService],
})
export class AppModule {}
