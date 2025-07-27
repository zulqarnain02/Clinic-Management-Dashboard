import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import { Queue } from '../../database/entities/queue.entity';
import { Patient } from '../../database/entities/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Queue, Patient])],
  controllers: [QueueController],
  providers: [QueueService],
})
export class QueueModule {} 