import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
export interface RegisterDto {
    email: string;
    name: string;
    password: string;
    phone?: string;
}
export interface LoginDto {
    email: string;
    password: string;
}
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
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
