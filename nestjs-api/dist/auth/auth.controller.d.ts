import { AuthService, LoginDto } from './auth.service';
import { OtpService } from './otp.service';
export declare class AuthController {
    private readonly authService;
    private readonly otpService;
    constructor(authService: AuthService, otpService: OtpService);
    validateRegistrationCode(body: {
        registrationCode: string;
    }): Promise<{
        valid: boolean;
        message: string;
        sessionId?: undefined;
        people?: undefined;
        otp?: undefined;
    } | {
        valid: boolean;
        sessionId: string;
        people: {
            name: string;
            last_name: string;
        };
        otp: string | null;
        message?: undefined;
    }>;
    verifyOtp(body: {
        sessionId: string;
        otp: string;
    }): Promise<{
        valid: boolean;
        message: string;
    } | {
        valid: boolean;
        message?: undefined;
    }>;
    completeRegistration(body: {
        sessionId: string;
        email: string;
        password: string;
    }): Promise<{
        user: import("../user/user.entity").User;
        token: string;
    } | {
        success: boolean;
        message: string;
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
