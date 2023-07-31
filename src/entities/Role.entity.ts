
import { Entity, PrimaryGeneratedColumn, Column,OneToMany, BaseEntity } from "typeorm"
import { User } from "./User.entity"

@Entity()
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    role: string

    @Column({ type: 'date',default: () => 'CURRENT_DATE'})
    createdAt: Date
    
    @Column({ nullable: true})
    updatedAt: Date

    @OneToMany(() =>User, (user) => user.role)
    user: User[]
}
