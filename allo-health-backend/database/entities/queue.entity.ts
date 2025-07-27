import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Patient } from './patient.entity';
import { Doctor } from './doctor.entity';

export enum QueueStatus {
  WAITING = 'WAITING',
  WITH_DOCTOR = 'WITH DOCTOR',
  COMPLETED = 'COMPLETED'
}

export enum QueuePriority {
  NORMAL = 'NORMAL',
  URGENT = 'URGENT'
}

@Entity()
export class Queue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  queueNumber: number;

  @Column({
    type: 'enum',
    enum: QueueStatus,
    default: QueueStatus.WAITING
  })
  status: QueueStatus;

  @Column({
    type: 'enum',
    enum: QueuePriority,
    default: QueuePriority.NORMAL
  })
  priority: QueuePriority;

  @CreateDateColumn()
  arrived_at: Date;

  @ManyToOne(() => Patient, patient => patient.queues, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  patient: Patient;

  @ManyToOne(() => Doctor, doctor => doctor.queues, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  doctor: Doctor;
} 