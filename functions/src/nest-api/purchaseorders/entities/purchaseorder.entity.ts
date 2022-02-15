import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany} from "typeorm";
import { Lineitem } from "../../lineitems/entities/lineitem.entity";
import { Supplier } from "../../suppliers/entities/supplier.entity";

@Entity()
export class Purchaseorder {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        default: 0
    })
    isDeleted: number

    @Column()
    amount: number;

    @Column()
    createdAt: string;

    @Column()
    deliveryDate: string;

    @Column()
    supplierId: number;

    @Column()
    purchaseOrderUrl: string;

    @ManyToOne( type => Supplier, supplier => supplier.purchaseOrders)
    supplier: Supplier;

    @OneToMany(type => Lineitem, lineItem => lineItem.purchaseOrder)
    lineItems: Lineitem[]
}
