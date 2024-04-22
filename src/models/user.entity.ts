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
  password!: string

  @Column()
  job!: string

  

  @OneToMany(() => Token, token => token.user)
  tokens!: Token[]  

}
