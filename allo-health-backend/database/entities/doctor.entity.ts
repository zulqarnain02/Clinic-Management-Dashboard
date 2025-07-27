import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Queue } from './queue.entity';
import { Appointment } from './appointment.entity';
import { DoctorSchedule } from './doctor-schedule.entity';

enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  specialization: string;

  @Column({
    type: 'enum',
    enum: Gender
  })
  gender: Gender;


  @OneToMany(() => Queue, queue => queue.doctor)
  queues: Queue[];

  @OneToMany(() => Appointment, appointment => appointment.doctor)
  appointments: Appointment[];

  @OneToMany(() => DoctorSchedule, schedule => schedule.doctor)
  schedules: DoctorSchedule[];
} 