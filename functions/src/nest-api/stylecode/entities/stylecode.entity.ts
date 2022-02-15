import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import { Bom } from "../../boms/entities/bom.entity";

@Entity()
export class Stylecode {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    styleCode: string;

    @Column()
    brand: string;

    @Column()
    product: string;

    @Column()
    productType: string;

    @Column()
    confirmDate: string;

    @Column()
    orderQty: number;
    
    @Column()
    makeQty: number;

    @Column()
    deliveryDate: string;

    @Column()
    styleCodeStatus:string;

    @Column({
        default: 0
    })
    isDeleted: number

    @OneToMany( type => Bom, bom => bom.styleCode)
    boms: Bom[]
}
