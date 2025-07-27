import { Injectable, Logger, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../../database/entities/doctor.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Injectable()
@UseGuards(JwtAuthGuard)
export class DoctorService {
  private readonly logger = new Logger(DoctorService.name);

  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>
  ) {}

  async getAllDoctorsWithSchedules() {
    this.logger.log('Fetching all doctors with their schedules');
    
    return this.doctorRepository.find({
      relations: ['schedules'],
      order: {
        id: 'ASC'
      }
    });
  }
} 