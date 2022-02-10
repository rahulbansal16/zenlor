import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseorderDto } from './create-purchaseorder.dto';

export class UpdatePurchaseorderDto extends PartialType(CreatePurchaseorderDto) {}
