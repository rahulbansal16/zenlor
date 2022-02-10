import { Purchaseorder } from "src/nest-api/purchaseorders/entities/purchaseorder.entity";
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";

@Entity()
export class lineItem {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        default: 0
    })
    isDeleted: number

    @Column()
    category: string;

    @Column()
    unit: string;

    @Column()
    type: string;

    @Column()
    materialId: string;

    @Column()
    materialDescription: string;

    @Column()
    purchaseQty: number

    @ManyToOne( type => Purchaseorder, purchaseOrder => purchaseOrder.lineItems)
    purchaseOrder: Purchaseorder
}
