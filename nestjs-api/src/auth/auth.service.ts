import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';
import { People } from '../people/people.entity';

export interface RegisterDto {
  email: string;
  name: string;
  password: string;
  phone?: string;
  registrationCode: string;
  country_id?: number;
  city_id?: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(People)
    private peopleRepository: Repository<People>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: User; token: string }> {
    const { email, name, password, phone, registrationCode, country_id, city_id } = registerDto;

    // Validate registration code
    const people = await this.peopleRepository.findOne({ 
      where: { registration_code: registrationCode } 
    });
    
    if (!people) {
      throw new BadRequestException('کد ثبت نام نامعتبر است');
    }

    // Check if this people already has a user account
    const existingUserForPeople = await this.userRepository.findOne({ 
      where: { people_id: people.id } 
    });
    
    if (existingUserForPeople) {
      throw new ConflictException('این عضو خانواده قبلاً حساب کاربری دارد');
    }

    // Check if user already exists with this email
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('کاربری با این ایمیل قبلاً وجود دارد');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user linked to people
    const user = this.userRepository.create({
      email,
      name,
      password: hashedPassword,
      phone,
      people_id: people.id,
      country_id,
      city_id,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const payload = { sub: savedUser.id, email: savedUser.email, role: savedUser.role };
    const token = this.jwtService.sign(payload);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = savedUser;

    return {
      user: userWithoutPassword as User,
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword as User,
      token,
    };
  }

  async validateUser(payload: any): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id: payload.sub },
      relations: ['country', 'city', 'people']
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async updateProfile(userId: number, profileData: { 
    country_id?: number; 
    city_id?: number; 
    name?: string; 
    phone?: string; 
  }): Promise<User> {
    await this.userRepository.update(userId, profileData);
    const updatedUser = await this.userRepository.findOne({ 
      where: { id: userId },
      relations: ['country', 'city', 'people']
    });
    if (!updatedUser) {
      throw new UnauthorizedException('User not found');
    }
    return updatedUser;
  }
}
