import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from 'database/entities/user.entity';
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  staffId: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role = Role.STAFF;
} 