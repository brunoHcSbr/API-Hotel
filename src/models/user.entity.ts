import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm'
import Token from './token.entity'

@Entity()
@Unique(["userNick"])
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column()
  userNick!: string

  @Column()
  job!: string

  @Column()
  password!: string

  @OneToMany(() => Token, token => token.user)
  tokens!: Token[]  

}
