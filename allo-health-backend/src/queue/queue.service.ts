import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue, QueueStatus, QueuePriority } from '../../database/entities/queue.entity';
import { Patient, Gender } from '../../database/entities/patient.entity';
import { CreateQueueDto } from './dto/create-queue.dto';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectRepository(Queue)
    private queueRepository: Repository<Queue>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  /**
   * Creates a new patient and adds them to the queue
   * @param createQueueDto - Patient and queue details
   * @returns Created queue entry with patient details
   */
  async addToQueue(createQueueDto: CreateQueueDto): Promise<Queue> {
    this.logger.log(`Adding new patient to queue: ${createQueueDto.patientName}`);
    
    const queueEntry = await this.queueRepository.manager.transaction(async transactionalEntityManager => {
      // Check if patient exists by mobile number
      let patient = await transactionalEntityManager.findOne(Patient, {
        where: { phone_number: createQueueDto.mobileNumber }
      });

      // If patient doesn't exist, create new patient
      if (!patient) {
        patient = transactionalEntityManager.create(Patient, {
          name: createQueueDto.patientName,
          age: createQueueDto.age,
          gender: createQueueDto.gender,
          phone_number: createQueueDto.mobileNumber,
          created_at: new Date(),
        });
        await transactionalEntityManager.save(Patient, patient);
      }
      const latestQueue = await transactionalEntityManager
        .createQueryBuilder(Queue, 'queue')
        .orderBy('queue.queueNumber', 'DESC')
        .getOne();

      const queueNumber = (latestQueue?.queueNumber || 0) + 1;

      const queue = transactionalEntityManager.create(Queue, {
        queueNumber,
        priority: createQueueDto.priority || QueuePriority.NORMAL,
        patient: patient,
        status: QueueStatus.WAITING,
      });

      return transactionalEntityManager.save(Queue, queue);
    });

    return queueEntry;
  }

  /**
   * Fetches all queued patients with optional status filter
   * @param status - Optional queue status filter
   * @returns Array of queue entries with patient details
   */
  async getQueue(status?: QueueStatus) {
    this.logger.log(`Fetching queue list with status filter: ${status}`);

    const queryBuilder = this.queueRepository
      .createQueryBuilder('queue')
      .leftJoinAndSelect('queue.patient', 'patient')
      .leftJoinAndSelect('queue.doctor', 'doctor')
      .orderBy('queue.priority', 'DESC')
      .addOrderBy('queue.arrived_at', 'ASC');

    if (status) {
      queryBuilder.where('queue.status = :status', { status });
    }

    return queryBuilder.getMany();
  }

  /**
   * Updates queue entry status or priority
   * @param id - Queue entry ID
   * @param updates - Status or priority updates
   * @returns Updated queue entry
   */
  async updateQueue(id: number, updates: Partial<Queue>) {
    this.logger.log(`Updating queue entry ${id}`);

    const queue = await this.queueRepository.findOne({
      where: { id },
      relations: ['patient'],
    });

    if (!queue) {
      throw new NotFoundException('Queue entry not found');
    }

    Object.assign(queue, updates);
    return this.queueRepository.save(queue);
  }

  /**
   * Removes a queue entry
   * @param id - Queue entry ID
   */
  async removeFromQueue(id: number) {
    this.logger.log(`Removing queue entry ${id}`);

    const result = await this.queueRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Queue entry not found');
    }
  }
} 