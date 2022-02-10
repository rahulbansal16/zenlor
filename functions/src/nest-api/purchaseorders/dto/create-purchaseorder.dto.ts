import { lineItem } from "src/nest-api/lineitems/entities/lineitem.entity";
import {IsNotEmpty } from 'class-validator';


export class CreatePurchaseorderDto {

    @IsNotEmpty()
    amount: number;

    @IsNotEmpty()
    createdAt: string;

    @IsNotEmpty()
    deliveryDate: string;

    @IsNotEmpty()
    supplierId: number;

    @IsNotEmpty()
    lineItems: lineItem[];
}
