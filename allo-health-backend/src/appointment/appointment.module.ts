import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { Appointment } from '../../database/entities/appointment.entity';
import { Doctor } from '../../database/entities/doctor.entity';
import { Patient } from '../../database/entities/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Doctor, Patient])],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {} 