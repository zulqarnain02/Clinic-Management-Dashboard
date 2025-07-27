import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Users } from 'database/entities/user.entity';
import { Staff } from 'database/entities/staff.entity';
import { Auth } from 'database/entities/auth.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Auth, Staff])
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
