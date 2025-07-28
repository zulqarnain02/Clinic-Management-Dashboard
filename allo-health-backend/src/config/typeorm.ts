import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Auth } from '../../database/entities/auth.entity';
import { Users } from '../../database/entities/user.entity';
import { Patient } from '../../database/entities/patient.entity';
import { Doctor } from '../../database/entities/doctor.entity';
import { Queue } from '../../database/entities/queue.entity';
import { Appointment } from '../../database/entities/appointment.entity';
import { DoctorSchedule } from '../../database/entities/doctor-schedule.entity';
import { Staff } from '../../database/entities/staff.entity';

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || '',
    entities: [Auth, Users, Patient, Doctor, Queue, Appointment, DoctorSchedule, Staff],
    synchronize: process.env.NODE_ENV !== 'prod',
    logging: true,
    ssl: {
        rejectUnauthorized: false,
    },
}); 