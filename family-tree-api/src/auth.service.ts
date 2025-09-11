import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { FamilyMember } from './entities/family-member.entity';
import { EmailService } from './services/email.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(FamilyMember)
    private familyMemberRepository: Repository<FamilyMember>,
    private emailService: EmailService,
  ) {}

  // ============= Registration & Invite Code Management =============

  async registerWithInviteCodeAndCredentials(registrationData: {
    inviteCode: string;
    name: string;
    family_name: string;
    fatherName: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    const { inviteCode, name, family_name, fatherName, email, password, phone } = registrationData;

    // Find the family member with the invite code
    const familyMember = await this.familyMemberRepository.findOne({
      where: { invite_code: inviteCode }
    });

    if (!familyMember) {
      throw new BadRequestException('کد دعوت نامعتبر است');
    }

    // Check if email already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('این ایمیل قبلاً ثبت شده است');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      is_verified: false,
      member_id: familyMember.id,
      phone: phone || null,
    });

    const savedUser = await this.userRepository.save(user);

    // Update family member with new data
    await this.familyMemberRepository.update(familyMember.id, {
      name,
      family_name,
      father_name: fatherName,
    });

    // Generate OTP for email verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.userRepository.update(savedUser.id, { otp });

    // Send verification email
    await this.emailService.sendVerificationEmail(email, otp);

    return {
      success: true,
      message: 'ثبت‌نام با موفقیت انجام شد. لطفاً ایمیل خود را تأیید کنید.',
      userId: savedUser.id,
    };
  }

  async registerWithInviteCode(inviteCode: string, newMemberData: { name: string; family_name: string }) {
    const familyMember = await this.familyMemberRepository.findOne({
      where: { invite_code: inviteCode }
    });

    if (!familyMember) {
      throw new BadRequestException('کد دعوت نامعتبر است');
    }

    // Update family member with new data
    await this.familyMemberRepository.update(familyMember.id, {
      name: newMemberData.name,
      family_name: newMemberData.family_name,
    });

    return {
      success: true,
      message: 'عضویت با موفقیت انجام شد',
      memberId: familyMember.id,
    };
  }

  async requestInviteCode(requestData: { 
    name: string; 
    fatherName: string; 
    email: string; 
    phone?: string; 
    message?: string; 
  }) {
    // Send email to admin about the request
    await this.emailService.sendInviteRequestEmail(requestData);
    
    return {
      success: true,
      message: 'درخواست شما ارسال شد. پس از بررسی، کد دعوت برای شما ارسال خواهد شد.',
    };
  }

  async findByInviteCode(inviteCode: string) {
    const familyMember = await this.familyMemberRepository.findOne({
      where: { invite_code: inviteCode }
    });

    if (!familyMember) {
      throw new BadRequestException('کد دعوت نامعتبر است');
    }

    return {
      success: true,
      member: {
        id: familyMember.id,
        name: familyMember.name,
        family_name: familyMember.family_name,
        father_name: familyMember.father_name,
      },
    };
  }

  // ============= Login & Authentication =============

  async loginWithCredentials(loginData: { email: string; password: string }) {
    const { email, password } = loginData;

    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['member']
    });

    if (!user) {
      throw new UnauthorizedException('ایمیل یا رمز عبور اشتباه است');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('ایمیل یا رمز عبور اشتباه است');
    }

    if (!user.is_verified) {
      throw new UnauthorizedException('لطفاً ابتدا ایمیل خود را تأیید کنید');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, memberId: user.member_id },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        is_verified: user.is_verified,
        member: user.member,
      },
    };
  }

  async adminLogin(loginData: { email: string; password: string }) {
    const { email, password } = loginData;

    // Check if it's admin email (you can configure this)
    const adminEmails = ['admin@example.com']; // Add your admin emails here
    
    if (!adminEmails.includes(email)) {
      throw new UnauthorizedException('دسترسی ادمین ندارید');
    }

    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['member']
    });

    if (!user) {
      throw new UnauthorizedException('ایمیل یا رمز عبور اشتباه است');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('ایمیل یا رمز عبور اشتباه است');
    }

    // Generate admin JWT token
    const adminToken = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: true },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );

    return {
      success: true,
      adminToken,
      user: {
        id: user.id,
        email: user.email,
        is_verified: user.is_verified,
        member: user.member,
      },
    };
  }

  // ============= Email Verification & OTP =============

  async verifyEmail(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new BadRequestException('کاربر یافت نشد');
    }

    await this.userRepository.update(id, { is_verified: true, otp: null });

    return {
      success: true,
      message: 'ایمیل با موفقیت تأیید شد',
    };
  }

  async verifyOtp(body: { email: string; otp: string }) {
    const { email, otp } = body;

    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new BadRequestException('کاربر یافت نشد');
    }

    if (user.otp !== otp) {
      throw new BadRequestException('کد تأیید اشتباه است');
    }

    await this.userRepository.update(user.id, { is_verified: true, otp: null });

    return {
      success: true,
      message: 'ایمیل با موفقیت تأیید شد',
    };
  }

  async resendOtp(body: { email: string }) {
    const { email } = body;

    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new BadRequestException('کاربر یافت نشد');
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.userRepository.update(user.id, { otp });

    // Send verification email
    await this.emailService.sendVerificationEmail(email, otp);

    return {
      success: true,
      message: 'کد تأیید جدید ارسال شد',
    };
  }

  // ============= User Profile Management =============

  async getCurrentUser(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;
      
      const user = await this.userRepository.findOne({
        where: { id: decoded.userId },
        relations: ['member']
      });

      if (!user) {
        throw new UnauthorizedException('کاربر یافت نشد');
      }

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          is_verified: user.is_verified,
          member: user.member,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('توکن نامعتبر است');
    }
  }

  async updateUserProfile(token: string, profileData: { profile_image?: string; national_id?: string }) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;
      
      const user = await this.userRepository.findOne({
        where: { id: decoded.userId },
        relations: ['member']
      });

      if (!user) {
        throw new UnauthorizedException('کاربر یافت نشد');
      }

      // Update user profile
      if (profileData.profile_image) {
        await this.userRepository.update(user.id, { profile_image: profileData.profile_image });
      }

      if (profileData.national_id) {
        // Check if national_id is unique
        const existingUser = await this.userRepository.findOne({
          where: { national_id: profileData.national_id }
        });
        
        if (existingUser && existingUser.id !== user.id) {
          throw new ConflictException('کد ملی قبلاً ثبت شده است');
        }
        
        await this.userRepository.update(user.id, { national_id: profileData.national_id });
      }

      // Update family member profile if exists
      if (user.member) {
        if (profileData.profile_image) {
          await this.familyMemberRepository.update(user.member.id, { profile_image: profileData.profile_image });
        }
        if (profileData.national_id) {
          await this.familyMemberRepository.update(user.member.id, { national_id: profileData.national_id });
        }
      }

      return {
        success: true,
        message: 'پروفایل با موفقیت به‌روزرسانی شد',
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new UnauthorizedException('توکن نامعتبر است');
    }
  }

  // ============= Password Management =============

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new BadRequestException('کاربر یافت نشد');
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '1h' }
    );

    // Send reset email
    await this.emailService.sendPasswordResetEmail(email, resetToken);

    return {
      success: true,
      message: 'لینک بازنشانی رمز عبور به ایمیل شما ارسال شد',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userRepository.update(decoded.userId, { password: hashedPassword });

      return {
        success: true,
        message: 'رمز عبور با موفقیت تغییر کرد',
      };
    } catch (error) {
      throw new UnauthorizedException('توکن نامعتبر یا منقضی شده است');
    }
  }

  async changePassword(token: string, currentPassword: string, newPassword: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;
      
      const user = await this.userRepository.findOne({ where: { id: decoded.userId } });
      
      if (!user) {
        throw new UnauthorizedException('کاربر یافت نشد');
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new BadRequestException('رمز عبور فعلی اشتباه است');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userRepository.update(user.id, { password: hashedPassword });

      return {
        success: true,
        message: 'رمز عبور با موفقیت تغییر کرد',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException('توکن نامعتبر است');
    }
  }

  // ============= Token Management =============

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'default-secret') as any;
      
      const user = await this.userRepository.findOne({ where: { id: decoded.userId } });
      
      if (!user) {
        throw new UnauthorizedException('کاربر یافت نشد');
      }

      // Generate new token
      const newToken = jwt.sign(
        { userId: user.id, email: user.email, memberId: user.member_id },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: '7d' }
      );

      return {
        success: true,
        token: newToken,
      };
    } catch (error) {
      throw new UnauthorizedException('توکن نامعتبر است');
    }
  }

  async logout(token: string) {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return success
    return {
      success: true,
      message: 'با موفقیت خارج شدید',
    };
  }

  async validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;
      
      const user = await this.userRepository.findOne({ where: { id: decoded.userId } });
      
      if (!user) {
        throw new UnauthorizedException('کاربر یافت نشد');
      }

      return {
        success: true,
        valid: true,
        user: {
          id: user.id,
          email: user.email,
          is_verified: user.is_verified,
        },
      };
    } catch (error) {
      return {
        success: true,
        valid: false,
        message: 'توکن نامعتبر است',
      };
    }
  }
}
