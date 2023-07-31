import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from "typeorm"
import { Role } from "./Role.entity";
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    firstName: string

    @Column({nullable: true})
    lastName: string;

    @Column({unique: true})
    email: string

    @Column() 
    password: string

    @Column({ type: 'date',default: () => 'CURRENT_DATE'})
    createdAt: Date

    @Column({ nullable: true})
    updatedAt: Date

    @ManyToOne(()=> Role, (role) => role.user)
    role: Role
}
