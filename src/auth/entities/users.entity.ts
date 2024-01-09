import { MinLength } from "class-validator";
import { Product } from "src/products/entities/product.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id:string;
    @Column('text',{
        unique:true
    })
    @MinLength(4)
    email:string;
    @Column('text')
    @MinLength(8)
    password:string;
    @Column('text')
    @MinLength(1)
    fullName:string;
    @Column('bool',{
        default:true
    })
    isActive:boolean;
    @Column('text',{
        array:true,
        default:['admin']
    })
    @MinLength(1)
    roles:string[];

    @OneToMany(
        ()=>Product,(producto)=>producto.user
    )
    product:Product;
    @BeforeInsert()
    checkField(){
        this.email=this.email.toLocaleLowerCase().trim();
    }
    @BeforeUpdate()
    check(){
        this.checkField();
    }
    
}
