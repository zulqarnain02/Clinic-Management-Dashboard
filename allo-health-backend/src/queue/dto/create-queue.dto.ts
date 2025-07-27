import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { QueuePriority, QueueStatus } from '../../../database/entities/queue.entity';
import { Gender } from '../../../database/entities/patient.entity';

export class CreateQueueDto {
  @IsString()
  patientName: string;

  @IsNumber()
  age: number;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  mobileNumber : string

  @IsOptional()
  @IsEnum(QueuePriority)
  priority?: QueuePriority;

  @IsOptional()
  @IsEnum(QueueStatus)
 status? : QueueStatus

} 