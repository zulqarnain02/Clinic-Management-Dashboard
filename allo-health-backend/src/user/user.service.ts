import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, Users } from '../../database/entities/user.entity';
import { Auth } from '../../database/entities/auth.entity';
import { Staff } from '../../database/entities/staff.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import { Logger } from '@nestjs/common';


@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {}

  /**
   * Validates if a staff member exists and is eligible for registration
   * @param staffId - The staff ID to validate
   * @returns The staff record if valid
   * @throws NotFoundException if staff doesn't exist
   * @throws ConflictException if staff is already registered
   */
  async validateStaff(staffId: string): Promise<Staff> {
    this.logger.debug(`Validating staff with ID: ${staffId}`);
    
    const staff = await this.staffRepository.findOne({ 
      where: { staffId } 
    });

    if (!staff) {
      this.logger.warn(`Staff with ID ${staffId} not found`);
      throw new NotFoundException('Staff ID not found in the system');
    }

    if (staff.isRegistered) {
      this.logger.warn(`Staff with ID ${staffId} is already registered`);
      throw new ConflictException('Staff member is already registered');
    }

    return staff;
  }

  async findOne(id: number): Promise<Users> {
    return this.usersRepository.findOne({ 
      where: { profileID: id },
      relations: ['auth']
    });
  }

  async findByUsername(username: string): Promise<Users> {
    return this.usersRepository.findOne({
      where: { auth: { username } },
      relations: ['auth']
    });
  }

  async create(registerDto: RegisterDto) {
    this.logger.debug(`Attempting to create dashboard access for staff ID: ${registerDto.staffId}`);

    // Validate staff ID and check registration status
    const staff = await this.validateStaff(registerDto.staffId);

    // Check if already registered
    const existingUser = await this.findByStaffId(registerDto.staffId);
    if (existingUser) {
      this.logger.warn(`Staff ID ${registerDto.staffId} already has dashboard access`);
      throw new ConflictException('Staff member already has dashboard access');
    }

    // Create auth record
    const auth = this.authRepository.create({
      username: registerDto.staffId, 
      password: registerDto.password,
    });
    await this.authRepository.save(auth);

    // Create user record
    const user = this.usersRepository.create({
      name: staff.name,
      email: staff.email,
      role: Role.STAFF,
      created_at: new Date(),
      auth: auth,
      staffId: registerDto.staffId
    });
    const savedUser = await this.usersRepository.save(user);

    staff.isRegistered = true;
    await this.staffRepository.save(staff);

    this.logger.log(`Successfully created dashboard access for staff ID: ${registerDto.staffId}`);
    return savedUser;
  }

  async findByStaffId(staffId: string): Promise<Users> {
    return this.usersRepository.findOne({
      where: { staffId },
      relations: ['auth']
    });
  }


}
