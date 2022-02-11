import {IsNotEmpty } from 'class-validator';
import { CreateLineitemDto } from '../../lineitems/dto/create-lineitem.dto';


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
    lineItems: CreateLineitemDto[];
}
