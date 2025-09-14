import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

@Injectable()
export class OtpService {
  private otpSessions: Map<string, OtpSession> = new Map();

  constructor(
    @InjectRepository(People)
    private peopleRepository: Repository<People>,
  ) {}

  async validateRegistrationCode(registrationCode: string): Promise<{ valid: boolean; people?: People }> {
    const people = await this.peopleRepository.findOne({ 
      where: { registration_code: registrationCode } 
    });
    
    if (!people) {
      return { valid: false };
    }

    return { valid: true, people };
  }

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  createOtpSession(registrationCode: string, peopleId: number): string {
    const sessionId = Math.random().toString(36).substring(2, 15);
    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    this.otpSessions.set(sessionId, {
      registrationCode,
      peopleId,
      otp,
      expiresAt,
    });

    return sessionId;
  }

  verifyOtp(sessionId: string, otp: string): boolean {
    const session = this.otpSessions.get(sessionId);
    
    if (!session) {
      return false;
    }

    if (new Date() > session.expiresAt) {
      this.otpSessions.delete(sessionId);
      return false;
    }

    if (session.otp !== otp) {
      return false;
    }

    return true;
  }

  getSession(sessionId: string): OtpSession | null {
    const session = this.otpSessions.get(sessionId);
    
    if (!session) {
      return null;
    }

    if (new Date() > session.expiresAt) {
      this.otpSessions.delete(sessionId);
      return null;
    }

    return session;
  }

  updateSession(sessionId: string, data: Partial<OtpSession>): boolean {
    const session = this.otpSessions.get(sessionId);
    
    if (!session) {
      return false;
    }

    if (new Date() > session.expiresAt) {
      this.otpSessions.delete(sessionId);
      return false;
    }

    this.otpSessions.set(sessionId, { ...session, ...data });
    return true;
  }

  deleteSession(sessionId: string): void {
    this.otpSessions.delete(sessionId);
  }

  // For development/testing - in production, use SMS/Email service
  getOtpForTesting(sessionId: string): string | null {
    const session = this.otpSessions.get(sessionId);
    return session ? session.otp : null;
  }
}
