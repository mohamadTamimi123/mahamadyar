import { AuthService } from './auth.service';
import { OtpService } from './otp.service';
import type { LoginDto as LoginDtoType } from './auth.service';
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
        country_id?: number;
        city_id?: number;
    }): Promise<{
        user: import("../user/user.entity").User;
        token: string;
    } | {
        success: boolean;
        message: string;
    }>;
    login(loginDto: LoginDtoType): Promise<{
        user: import("../user/user.entity").User;
        token: string;
    }>;
    getProfile(req: any): Promise<any>;
    updateProfile(req: any, body: {
        country_id?: number;
        city_id?: number;
        name?: string;
        phone?: string;
    }): Promise<{
        success: boolean;
        user: import("../user/user.entity").User;
    }>;
}
