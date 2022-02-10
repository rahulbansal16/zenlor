import { Purchaseorder } from "src/nest-api/purchaseorders/entities/purchaseorder.entity";
import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm";

@Entity()
export class Supplier {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        default: 0
    })
    isDeleted: number
    
    @Column()
    name: string;

    @Column()
    contact: string;

    @Column()
    address: string;

    @OneToMany( type => Purchaseorder, purchaseorder=> purchaseorder.supplier)
    purchaseOrders: Purchaseorder[]

}
