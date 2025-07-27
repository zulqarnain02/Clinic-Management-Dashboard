import { Controller, Post, Get, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { QueueService } from './queue.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { Queue, QueueStatus } from '../../database/entities/queue.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('queue')
@UseGuards(JwtAuthGuard)
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('addQueue')
  async addToQueue(@Body() createQueueDto: CreateQueueDto) {
    return this.queueService.addToQueue(createQueueDto);
  }

  @Get('getQueue')
  async getQueue(@Query('status') status?: QueueStatus) {
    return this.queueService.getQueue(status);
  }

  @Patch(':id')
  async updateQueue(
    @Param('id', ParseIntPipe) id: number,
    @Body() updates: Partial<Queue>
  ) {
    return this.queueService.updateQueue(id, updates);
  }

  @Delete(':id')
  async removeFromQueue(@Param('id', ParseIntPipe) id: number) {
    return this.queueService.removeFromQueue(id);
  }
} 