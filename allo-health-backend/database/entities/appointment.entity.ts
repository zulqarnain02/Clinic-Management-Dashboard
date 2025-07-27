import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Patient } from './patient.entity';
import { Doctor } from './doctor.entity';

export enum AppointmentStatus {
  BOOKED = 'BOOKED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  appointmentDate: Date;

  @Column({ type: 'time' })
  time: string;


  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.BOOKED
  })
  status: AppointmentStatus;

  @Column('jsonb', { nullable: true })
  metadata: {
    notes?: string;
    reason?: string;
    previousAppointments?: number[];
    cancellationReason?: string;
  };

  @ManyToOne(() => Patient, patient => patient.appointments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  patient: Patient;

  @ManyToOne(() => Doctor, doctor => doctor.appointments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  doctor: Doctor;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;
} 