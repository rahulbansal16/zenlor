import {Product,
    ProductCategory,
    ProductType,
    FitType} from "../../../types/styleCodesInfo"
  
import {IsNotEmpty } from 'class-validator';

export class CreateStylecodeDto {


    @IsNotEmpty()
    styleCode: string;

    @IsNotEmpty()
    buyer: string;

    @IsNotEmpty()
    brand: string;

    season?: string;
    salesChannel?: string;
    product: Product;
    productType: ProductType;
    productCategory: ProductCategory;
    productColor: string;
    productMRP?: number;
    styleDescription?: string;
    fitType?: FitType;
    collarType?:string;
    sleeveType?:string;
    fabricContent?:string;
    fabricPattern?:string;
    fabricWeave?:string;
    fabricWash?:string;
    orderNo?:string;
    confirmDate: string;
    orderQty: number;
    makeQty: number;
    deliveryDate: string;
    unitSellingPrice?:number;
    xsSizeQty?:number;
    sSizeQty?:number;
    mSizeQty?:number;
    xlSizeQty?:number;
    xxlSizeQty?:number;
    styleCodeStatus:string;
}
