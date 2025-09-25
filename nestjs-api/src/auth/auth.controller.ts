import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InviteRequest } from './invite-request.entity';
import { AuthService, RegisterDto, LoginDto } from './auth.service';
import { OtpService } from './otp.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { LoginDto as LoginDtoType } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
    @InjectRepository(InviteRequest)
    private readonly inviteRepo: Repository<InviteRequest>,
  ) {}

  @Post('validate-code')
  async validateRegistrationCode(@Body() body: { registrationCode: string }) {
    const result = await this.otpService.validateRegistrationCode(body.registrationCode);
    
    if (!result.valid || !result.people) {
      return { valid: false, message: 'کد ثبت نام نامعتبر است' };
    }

    const sessionId = this.otpService.createOtpSession(body.registrationCode, result.people.id);
    
    return {
      valid: true,
      sessionId,
      people: {
        name: result.people.name,
        last_name: result.people.last_name,
      },
      // For development - remove in production
      otp: this.otpService.getOtpForTesting(sessionId),
    };
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { sessionId: string; otp: string }) {
    const isValid = this.otpService.verifyOtp(body.sessionId, body.otp);
    
    if (!isValid) {
      return { valid: false, message: 'کد OTP نامعتبر یا منقضی شده است' };
    }

    return { valid: true };
  }

  @Post('complete-registration')
  async completeRegistration(@Body() body: { 
    sessionId: string; 
    email: string; 
    password: string;
    country_id?: number;
    city_id?: number;
  }) {
    const session = this.otpService.getSession(body.sessionId);
    
    if (!session) {
      return { success: false, message: 'جلسه منقضی شده است' };
    }

    // Update session with email
    this.otpService.updateSession(body.sessionId, { email: body.email });

    // Complete registration
    const registerDto: RegisterDto = {
      email: body.email,
      name: session.name || '',
      password: body.password,
      phone: session.phone,
      registrationCode: session.registrationCode,
      country_id: body.country_id,
      city_id: body.city_id,
    };

    const result = await this.authService.register(registerDto);
    
    // Clean up session
    this.otpService.deleteSession(body.sessionId);

    return result;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDtoType) {
    return this.authService.login(loginDto);
  }

  // Minimal endpoint to accept invite requests (can be persisted later)
  @Post('request-invite')
  async requestInvite(@Body() body: { name: string; email: string; message?: string }) {
    const req = this.inviteRepo.create({
      name: body?.name,
      email: body?.email,
      message: body?.message ?? null,
      status: 'pending',
    });
    await this.inviteRepo.save(req);
    return { success: true, id: req.id };
  }

  @Get('invite-requests')
  async listInviteRequests() {
    const items = await this.inviteRepo.find({ order: { createdAt: 'DESC' } });
    return { items };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-profile')
  async updateProfile(@Request() req, @Body() body: { 
    country_id?: number; 
    city_id?: number; 
    name?: string; 
    phone?: string; 
  }) {
    const userId = req.user.id;
    
    // Update user with new profile data
    const updatedUser = await this.authService.updateProfile(userId, body);
    
    return { success: true, user: updatedUser };
  }
}
