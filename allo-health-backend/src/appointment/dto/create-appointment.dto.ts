import { IsDate, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
  @IsNumber()
  doctorId: number;

  @IsString()
  patientName: string;

  @IsString()
  appointmentDate: string;

  @IsString()
  time : string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  reason?: string;
} 