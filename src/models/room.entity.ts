import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import User from './user.entity'

@Entity()
export default class Room extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  toWalk!: number

  @Column()
  statusRoom!: string

  @Column()
  bed!: number

  @Column()
  bath!: number

  @Column()
  outhers!: number

  //@Column({name: 'user_id'})
  //userId!: number

  //@ManyToOne(() => User, user => user.tasks)
  //user!: User  
}
