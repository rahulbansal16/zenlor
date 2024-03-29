import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import { Purchaseorder } from "../../purchaseorders/entities/purchaseorder.entity";

@Entity()
export class Lineitem {

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
