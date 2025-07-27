import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../../database/entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Doctor } from '../../database/entities/doctor.entity';
import { Patient } from '../../database/entities/patient.entity';
import { AppointmentStatus } from '../../database/entities/appointment.entity';

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name);

  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  private formatTimeString(time: string): string {
    // Convert "11.30" to "11:30:00"
    return time.replace('.', ':') + ':00';
  }

  /**
   * Creates a new appointment
   * @param createAppointmentDto - Appointment details
   * @returns Created appointment
   */
  async createAppointment(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    this.logger.log(`Creating new appointment for patient ${createAppointmentDto.patientName}`);

    const doctor = await this.doctorRepository.findOne({ 
      where: { id: createAppointmentDto.doctorId }
    });
    if (!doctor) throw new NotFoundException('Doctor not found');

    let patient = await this.patientRepository.findOne({ 
      where: { name: createAppointmentDto.patientName }
    });
    
    if (!patient) {
      patient = await this.patientRepository.save({
        name: createAppointmentDto.patientName,
        created_at: new Date()
      });
      this.logger.log(`Created new patient: ${patient.name}`);
    }

    const appointment = this.appointmentRepository.create({
      appointmentDate: new Date(createAppointmentDto.appointmentDate),
      time: this.formatTimeString(createAppointmentDto.time),
      status: AppointmentStatus.BOOKED,
      doctor,
      patient,
    });

    return this.appointmentRepository.save(appointment);
  }

  /**
   * Fetches appointments with optional filters
   * @param filters - Optional filters for doctor, patient, or status
   * @returns Filtered appointments
   */
  async getAppointments(filters: {
    doctorId?: number;
    patientId?: number;
    status?: AppointmentStatus;
  }) {
    this.logger.log('Fetching appointments with filters:', filters);

    const queryBuilder = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .orderBy('appointment.appointmentDate', 'DESC')
      .addOrderBy('appointment.time', 'ASC');

    if (filters.doctorId) {
      queryBuilder.andWhere('doctor.id = :doctorId', { doctorId: filters.doctorId });
    }

    if (filters.patientId) {
      queryBuilder.andWhere('patient.id = :patientId', { patientId: filters.patientId });
    }

    if (filters.status) {
      queryBuilder.andWhere('appointment.status = :status', { status: filters.status });
    }

    return queryBuilder.getMany();
  }

  /**
   * Updates an existing appointment
   * @param id - Appointment ID
   * @param updates - Updates to apply
   * @returns Updated appointment
   */
  async updateAppointment(id: number, updates: Partial<CreateAppointmentDto>): Promise<Appointment> {
    this.logger.log(`Updating appointment ${id}`);

    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['doctor', 'patient'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    Object.assign(appointment, updates);
    return this.appointmentRepository.save(appointment);
  }

  /**
   * Cancels an appointment
   * @param id - Appointment ID
   * @returns Cancelled appointment
   */
  async cancelAppointment(id: number): Promise<Appointment> {
    this.logger.log(`Cancelling appointment ${id}`);

    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['doctor', 'patient'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    appointment.status = AppointmentStatus.CANCELLED;
    return this.appointmentRepository.save(appointment);
  }

  async getAllAppointments() {
    return this.appointmentRepository.find({
      relations: ['doctor', 'patient'],
      order: {
        appointmentDate: 'DESC',
        time: 'ASC'
      }
    });
  }

  async getAppointmentsByDoctor(doctorId: number) {
    return this.appointmentRepository.find({
      where: { doctor: { id: doctorId } },
      relations: ['doctor', 'patient'],
      order: {
        appointmentDate: 'DESC',
        time: 'ASC'
      }
    });
  }

  async getAppointmentsByPatient(patientId: number) {
    return this.appointmentRepository.find({
      where: { patient: { id: patientId } },
      relations: ['doctor', 'patient'],
      order: {
        appointmentDate: 'DESC',
        time: 'ASC'
      }
    });
  }
} 