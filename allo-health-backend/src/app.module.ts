import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import configuration from '../config/configuration';
import * as fs from 'fs';
import * as path from 'path';
import { LoggerMiddleware } from '../middleware/logger.middleware';
import { QueueModule } from './queue/queue.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host') || 'host',
        port: configService.get('database.port') || 3000,
        username: configService.get('database.username') || 'root',
        password: configService.get('database.password') || 'root',
        database: configService.get('database.database') || 'defaultdb',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true,
        // ssl: {
        //   rejectUnauthorized: false,
        //   // ca: configService.get('CA_CERT') || fs.readFileSync(path.join(process.cwd(), 'ca.pem'))
        //   ca: configService.get('CA_CERT')
        // }
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    QueueModule,
    DoctorModule,
    AppointmentModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
