import { Repository } from 'typeorm';
import { People } from '../people/people.entity';
export interface OtpSession {
    registrationCode: string;
    peopleId: number;
    otp: string;
    expiresAt: Date;
    email?: string;
    name?: string;
    phone?: string;
}
export declare class OtpService {
    private peopleRepository;
    private otpSessions;
    constructor(peopleRepository: Repository<People>);
    validateRegistrationCode(registrationCode: string): Promise<{
        valid: boolean;
        people?: People;
    }>;
    generateOtp(): string;
    createOtpSession(registrationCode: string, peopleId: number): string;
    verifyOtp(sessionId: string, otp: string): boolean;
    getSession(sessionId: string): OtpSession | null;
    updateSession(sessionId: string, data: Partial<OtpSession>): boolean;
    deleteSession(sessionId: string): void;
    getOtpForTesting(sessionId: string): string | null;
}
