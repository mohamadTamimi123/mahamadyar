import { AuthService, RegisterDto, LoginDto } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: import("../user/user.entity").User;
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: import("../user/user.entity").User;
        token: string;
    }>;
    getProfile(req: any): Promise<any>;
    verifyToken(req: any): Promise<{
        valid: boolean;
        user: any;
    }>;
}
