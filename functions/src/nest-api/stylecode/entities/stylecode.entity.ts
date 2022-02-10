import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

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

}
