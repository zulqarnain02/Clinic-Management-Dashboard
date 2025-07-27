import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Doctor } from './doctor.entity';
import { IsOptional } from 'class-validator';

interface TimeSlot {
  time: string;
  status: 'available' | 'booked' | 'blocked';
  appointmentId?: number;
}

@Entity()
export class DoctorSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Doctor, doctor => doctor.schedules, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  doctor: Doctor;

//   @Column({ type: 'date' })
//   date: Date;

  @Column('jsonb')
  slots: TimeSlot[];

   @IsOptional()
  @Column('jsonb', { nullable: true })
  metadata: {
    dayType?: 'regular' | 'holiday' | 'special';
    notes?: string;
    customHours?: {
      start: string;
      end: string;
    };
  };

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;
} 