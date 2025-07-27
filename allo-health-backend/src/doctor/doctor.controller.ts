import { Controller, Get, UseGuards } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('doctors')
@UseGuards(JwtAuthGuard)
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  async getAllDoctors() {
    return this.doctorService.getAllDoctorsWithSchedules();
  }
} 