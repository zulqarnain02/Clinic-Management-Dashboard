import { Controller, Post, Get, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentStatus } from 'database/entities/appointment.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'database/entities/user.entity';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post('create')
  async createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.createAppointment(createAppointmentDto);
  }

  @Get('get')
  async getAppointments(
    @Query('doctorId') doctorId?: number,
    @Query('patientId') patientId?: number,
    @Query('status') status?: AppointmentStatus,
  ) {
    return this.appointmentService.getAppointments({ doctorId, patientId, status });
  }

  @Put('update/:id')
  @UseGuards(JwtAuthGuard)
  async updateAppointment(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAppointmentDto: Partial<CreateAppointmentDto>
  ) {
    return this.appointmentService.updateAppointment(id, updateAppointmentDto);
  }

  @Delete('cancel/:id')
  @UseGuards(JwtAuthGuard)
  async cancelAppointment(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.cancelAppointment(id);
  }

  @Get('admin/all')

  @Roles(Role.ADMIN)
  async getAllAppointments() {
    return this.appointmentService.getAllAppointments();
  }

  @Get('admin/doctor/:doctorId')
  @Roles(Role.ADMIN)
  async getAppointmentsByDoctor(
    @Param('doctorId', ParseIntPipe) doctorId: number
  ) {
    return this.appointmentService.getAppointmentsByDoctor(doctorId);
  }

  @Get('admin/patient/:patientId')
  @Roles(Role.ADMIN)
  async getAppointmentsByPatient(
    @Param('patientId', ParseIntPipe) patientId: number
  ) {
    return this.appointmentService.getAppointmentsByPatient(patientId);
  }
} 