import { DataSource } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { Users } from './entities/user.entity';
import { Patient } from './entities/patient.entity';
import { Doctor } from './entities/doctor.entity';
import { Queue } from './entities/queue.entity';
import { Appointment } from './entities/appointment.entity';
import { DoctorSchedule } from './entities/doctor-schedule.entity';
import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const logger = new Logger('DatabaseProvider');

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      try {
        logger.log('Attempting to create database connection');
        
        const dataSource = new DataSource({
          type: 'postgres',
          host: process.env.DB_HOST || "",
          port: parseInt(process.env.DB_PORT) || 3000,
          username: process.env.DB_USERNAME || '',
          password: process.env.DB_PASSWORD || '',
          database: process.env.DB_DATABASE || '',
          entities: [Auth, Users, Patient, Doctor, Queue, Appointment, DoctorSchedule],
          synchronize: process.env.NODE_ENV !== 'prod',
          logging: true,
          ssl: {
            rejectUnauthorized: false,
            ca: fs.readFileSync(path.join(process.cwd(), 'ca.pem'))
          }
        });

        logger.log('Database configuration created, attempting to initialize...');
        const initializedDataSource = await dataSource.initialize();
        logger.log('Database connection successful');
        return initializedDataSource;
      } catch (error) {
        logger.error('Failed to connect to database', error.stack);
        throw error;
      }
    },
  },
];
