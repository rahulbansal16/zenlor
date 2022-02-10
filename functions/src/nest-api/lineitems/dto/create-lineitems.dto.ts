import {IsNotEmpty } from 'class-validator';

export class CreateLineitemsDto {

    @IsNotEmpty()
    category: number;

    @IsNotEmpty()
    unit: string;

    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    materialId: string;

    @IsNotEmpty()
    materialDescription: string;

    @IsNotEmpty()
    purchaseQty: number;
}
