import { Controller, Post, Body, Param, Get, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ============= Registration & Invite Code Management =============
  
  @Post('register-with-credentials')
  registerWithCredentials(@Body() registrationData: {
    inviteCode: string;
    name: string;
    family_name: string;
    fatherName: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    return this.authService.registerWithInviteCodeAndCredentials(registrationData);
  }

  @Post('register/:inviteCode')
  registerWithInviteCode(
    @Param('inviteCode') inviteCode: string,
    @Body() newMemberData: { name: string; family_name: string }
  ) {
    return this.authService.registerWithInviteCode(inviteCode, newMemberData);
  }

  @Post('request-invite')
  requestInviteCode(@Body() requestData: { 
    name: string; 
    fatherName: string; 
    email: string; 
    phone?: string; 
    message?: string; 
  }) {
    return this.authService.requestInviteCode(requestData);
  }

  @Get('invite/:inviteCode')
  findByInviteCode(@Param('inviteCode') inviteCode: string) {
    return this.authService.findByInviteCode(inviteCode);
  }

  // ============= Login & Authentication =============
  
  @Post('login')
  login(@Body() loginData: {
    email: string;
    password: string;
  }) {
    return this.authService.loginWithCredentials(loginData);
  }

  @Post('admin-login')
  adminLogin(@Body() loginData: {
    email: string;
    password: string;
  }) {
    return this.authService.adminLogin(loginData);
  }

  // ============= Email Verification & OTP =============
  
  @Post('verify-email/:id')
  verifyEmail(@Param('id') id: string) {
    return this.authService.verifyEmail(+id);
  }

  @Post('verify-otp')
  verifyOtp(@Body() body: { email: string; otp: string }) {
    return this.authService.verifyOtp(body);
  }

  @Post('resend-otp')
  resendOtp(@Body() body: { email: string }) {
    return this.authService.resendOtp(body);
  }

  // ============= User Profile Management =============
  
  @Get('me')
  getCurrentUser(@Body() token: { token: string }) {
    return this.authService.getCurrentUser(token.token);
  }

  @Patch('profile')
  updateProfile(@Body() body: { 
    token: string;
    profile_image?: string; 
    national_id?: string; 
  }) {
    return this.authService.updateUserProfile(body.token, body);
  }

  // ============= Password Management =============
  
  @Post('forgot-password')
  forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  resetPassword(@Body() body: { 
    token: string; 
    newPassword: string; 
  }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  @Post('change-password')
  changePassword(@Body() body: { 
    token: string; 
    currentPassword: string; 
    newPassword: string; 
  }) {
    return this.authService.changePassword(body.token, body.currentPassword, body.newPassword);
  }

  // ============= Token Management =============
  
  @Post('refresh-token')
  refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post('logout')
  logout(@Body() body: { token: string }) {
    return this.authService.logout(body.token);
  }

  @Post('validate-token')
  validateToken(@Body() body: { token: string }) {
    return this.authService.validateToken(body.token);
  }
}
