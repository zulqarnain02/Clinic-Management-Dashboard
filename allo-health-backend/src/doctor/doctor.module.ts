import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { Doctor } from '../../database/entities/doctor.entity';
import { DoctorSchedule } from '../../database/entities/doctor-schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, DoctorSchedule])],
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorModule {} 