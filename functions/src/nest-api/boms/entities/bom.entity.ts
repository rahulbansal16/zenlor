import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import { Stylecode } from "../../stylecode/entities/stylecode.entity";

@Entity()
export class Bom {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: 0})
    isDeleted: number

    @ManyToOne( type=> Stylecode, stylecode => stylecode.boms)
    styleCode: string;

    @Column()
    no: number;

    @Column()
    category: string;

    @Column()
    type: string;

    @Column()
    materialId: string;

    materialDescription: string;

    @Column()
    consumption: number;

    @Column()
    wastage: number;

    @Column()
    unit: string;

    @Column()
    placement: string;

    @Column()
    reqQty: number;

    @Column({default:0})
    inventory: number;

    @Column({default:0})
    activeOrdersQty?: number;

    @Column({default: 0})
    pendingQty: number;

    @Column({default:0})
    issueQty: number
}
