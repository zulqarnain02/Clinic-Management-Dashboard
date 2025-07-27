import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Auth } from './auth.entity';

export enum Role {
  STAFF = 'STAFF',
  ADMIN = 'ADMIN'
}

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  profileID: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  staffId: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.STAFF
  })
  role: Role;

  @Column()
  created_at: Date;

  @OneToOne(() => Auth, auth => auth.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'profileID' })
  auth: Auth;

} 