import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column()
  username: string;

  @OneToOne(() => Users, user => user.auth, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  user: Users;
} 