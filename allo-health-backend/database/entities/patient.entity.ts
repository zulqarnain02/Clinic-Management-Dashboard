import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Queue } from './queue.entity';
import { Appointment } from './appointment.entity';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  age: number;

  
  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true
  })
  gender: Gender;

  @Column({ nullable: true })
  phone_number: string;

  @Column()
  created_at: Date;

  @OneToMany(() => Queue, queue => queue.patient)
  queues: Queue[];

  @OneToMany(() => Appointment, appointment => appointment.patient)
  appointments: Appointment[];
} 