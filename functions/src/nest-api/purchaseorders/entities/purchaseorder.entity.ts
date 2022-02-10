import { lineItem } from "src/nest-api/lineitems/entities/lineitem.entity";
import { Supplier } from "src/nest-api/suppliers/entities/supplier.entity";
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany} from "typeorm";

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

    @ManyToOne( type => Supplier, supplier => supplier.purchaseOrders)
    supplier: Supplier;

    @OneToMany(type => lineItem, lineItem => lineItem.purchaseOrder)
    lineItems: lineItem[]
}
