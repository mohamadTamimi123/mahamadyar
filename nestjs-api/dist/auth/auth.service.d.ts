import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { People } from '../people/people.entity';
export interface RegisterDto {
    email: string;
    name: string;
    password: string;
    phone?: string;
    registrationCode: string;
}
export interface LoginDto {
    email: string;
    password: string;
}
export declare class AuthService {
    private userRepository;
    private peopleRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, peopleRepository: Repository<People>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: User;
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: User;
        token: string;
    }>;
    validateUser(payload: any): Promise<User>;
}
