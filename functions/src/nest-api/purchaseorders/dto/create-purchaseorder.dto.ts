import {IsNotEmpty } from 'class-validator';
import { Lineitem } from '../../lineitems/entities/lineitem.entity';


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
    lineItems: Lineitem[];
}
