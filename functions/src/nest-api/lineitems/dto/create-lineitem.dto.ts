import {IsNotEmpty } from 'class-validator';

export class CreateLineitemDto {

    @IsNotEmpty()
    category: string;

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
