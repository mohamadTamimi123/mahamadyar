import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService, RegisterDto, LoginDto } from './auth.service';
import { OtpService } from './otp.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  @Post('validate-code')
  async validateRegistrationCode(@Body() body: { registrationCode: string }) {
    const result = await this.otpService.validateRegistrationCode(body.registrationCode);
    
    if (!result.valid) {
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
    };

    const result = await this.authService.register(registerDto);
    
    // Clean up session
    this.otpService.deleteSession(body.sessionId);

    return result;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  async verifyToken(@Request() req) {
    return { valid: true, user: req.user };
  }
}
