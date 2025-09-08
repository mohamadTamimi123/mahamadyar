import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FamilyMember } from './entities/family-member.entity';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { EmailService } from './services/email.service';
import { ConfigService } from '@nestjs/config';
import jwt, { SignOptions } from 'jsonwebtoken';

@Injectable()
export class FamilyMemberService {
  constructor(
    @InjectRepository(FamilyMember)
    private familyMemberRepository: Repository<FamilyMember>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async create(createFamilyMemberDto: { name: string; family_name: string; father_id?: number }): Promise<FamilyMember> {
    const familyMember = this.familyMemberRepository.create(createFamilyMemberDto);
    familyMember.invite_code = this.generateInviteCode();
    return this.familyMemberRepository.save(familyMember);
  }

  // تولید کد دعوت منحصر به فرد
  private generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async findAll(): Promise<FamilyMember[]> {
    const members = await this.familyMemberRepository.find({
      relations: ['father', 'children']
    });
    
    // برای هر عضو، اگر پدر دارد، نام پدر را از relation پر کن
    members.forEach(member => {
      if (member.father) {
        member.father_name = member.father.name;
      }
    });
    
    return members;
  }

  async findOne(id: number): Promise<FamilyMember | null> {
    return this.familyMemberRepository.findOne({ where: { id } });
  }

  async update(id: number, updateFamilyMemberDto: { name?: string; family_name?: string; father_id?: number }): Promise<FamilyMember | null> {
    await this.familyMemberRepository.update(id, updateFamilyMemberDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.familyMemberRepository.delete(id);
  }

  // ایمپورت فقط نام‌ها از JSON
  async importNamesFromJson(jsonData: any[]): Promise<{ imported: number; errors: any[] }> {
    let imported = 0;
    const errors: any[] = [];

    for (const item of jsonData) {
      try {
        if (!item.personName) {
          errors.push({ blockId: item.blockId, error: 'Missing person name', item });
          continue;
        }

        const familyMember = this.familyMemberRepository.create({
          name: item.personName,
        });

        await this.familyMemberRepository.save(familyMember);
        imported++;
      } catch (error) {
        errors.push({
          blockId: item.blockId,
          error: error.message,
          item,
        });
      }
    }

    return { imported, errors };
  }

  // دریافت تعداد کل اعضا
  async getTotalCount(): Promise<number> {
    return this.familyMemberRepository.count();
  }

  // جستجو بر اساس نام
  async searchByName(searchTerm: string): Promise<FamilyMember[]> {
    return this.familyMemberRepository
      .createQueryBuilder('family')
      .leftJoinAndSelect('family.father', 'father')
      .leftJoinAndSelect('family.children', 'children')
      .where('family.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .getMany();
  }

  // دریافت درخت خانوادگی کامل
  async getFamilyTree(): Promise<FamilyMember[]> {
    return this.familyMemberRepository.find({
      relations: ['father', 'children'],
      order: {
        name: 'ASC'
      }
    });
  }

  // دریافت فقط ریشه‌های درخت (کسانی که پدر ندارند)
  async getRootMembers(): Promise<FamilyMember[]> {
    return this.familyMemberRepository.find({
      where: { father_id: undefined },
      relations: ['children'],
      order: {
        name: 'ASC'
      }
    });
  }

  // دریافت فرزندان یک شخص
  async getChildren(parentId: number): Promise<FamilyMember[]> {
    return this.familyMemberRepository.find({
      where: { father_id: parentId },
      relations: ['children'],
      order: {
        name: 'ASC'
      }
    });
  }

  // ایجاد رابطه پدر-فرزندی
  async setParent(childId: number, parentId: number): Promise<FamilyMember | null> {
    const child = await this.findOne(childId);
    const parent = await this.findOne(parentId);
    
    if (!child || !parent) {
      return null;
    }

    child.father_id = parentId;
    child.father_name = parent.name;
    
    return this.familyMemberRepository.save(child);
  }

  // ویرایش نام پدر برای یک عضو
  async updateFatherName(memberId: number, fatherName: string): Promise<FamilyMember | null> {
    const member = await this.findOne(memberId);
    if (!member) {
      return null;
    }

    member.father_name = fatherName;
    
    return this.familyMemberRepository.save(member);
  }

  // حذف رابطه پدر-فرزندی
  async removeParent(memberId: number): Promise<FamilyMember | null> {
    const member = await this.findOne(memberId);
    if (!member) {
      return null;
    }

    member.father_id = null;
    member.father_name = null;
    
    return this.familyMemberRepository.save(member);
  }

  // تولید کد دعوت جدید برای یک عضو
  async generateNewInviteCode(memberId: number): Promise<FamilyMember | null> {
    const member = await this.findOne(memberId);
    if (!member) {
      return null;
    }

    member.invite_code = this.generateInviteCode();
    return this.familyMemberRepository.save(member);
  }

  // پیدا کردن عضو بر اساس کد دعوت
  async findByInviteCode(inviteCode: string): Promise<FamilyMember | null> {
    const member = await this.familyMemberRepository.findOne({ 
      where: { invite_code: inviteCode },
      relations: ['father', 'children']
    });
    
    // اگر عضو پیدا شد و پدر دارد، نام پدر را از relation پر کن
    if (member && member.father) {
      member.father_name = member.father.name;
    }
    
    return member;
  }

  // ثبت‌نام عضو جدید با کد دعوت
  async registerWithInviteCode(inviteCode: string, newMemberData: { name: string; family_name: string }): Promise<FamilyMember | null> {
    const inviter = await this.findByInviteCode(inviteCode);
    if (!inviter) {
      return null;
    }

    const newMember = this.familyMemberRepository.create({
      ...newMemberData,
      invite_code: this.generateInviteCode()
    });

    return this.familyMemberRepository.save(newMember);
  }

  // ادیت کامل عضو
  async editMember(memberId: number, editData: { name?: string; family_name?: string; father_id?: number | null }): Promise<FamilyMember | null> {
    const member = await this.findOne(memberId);
    if (!member) {
      return null;
    }

    // بروزرسانی نام
    if (editData.name !== undefined) {
      member.name = editData.name;
    }

    // بروزرسانی نام خانوادگی
    if (editData.family_name !== undefined) {
      member.family_name = editData.family_name;
    }

    // بروزرسانی رابطه پدر-فرزندی
    if (editData.father_id !== undefined) {
      if (editData.father_id === null) {
        // حذف رابطه پدر-فرزندی
        member.father_id = null;
        member.father_name = null;
      } else {
        // تنظیم پدر جدید
        const father = await this.findOne(editData.father_id);
        if (father) {
          member.father_id = editData.father_id;
          member.father_name = father.name;
        }
      }
    }

    return this.familyMemberRepository.save(member);
  }

  // درخواست کد دعوت
  async requestInviteCode(requestData: { 
    name: string; 
    fatherName: string; 
    email: string; 
    phone?: string; 
    message?: string; 
  }): Promise<{ success: boolean; message: string }> {
    try {
      // ذخیره درخواست در دیتابیس (اختیاری)
      console.log('درخواست کد دعوت دریافت شد:', requestData);
      
      // ارسال ایمیل به ادمین (شبیه‌سازی)
      await this.sendEmailToAdmin(requestData);
      
      return {
        success: true,
        message: 'درخواست شما با موفقیت ارسال شد و به مدیران اطلاع داده شد'
      };
    } catch (error) {
      console.error('خطا در پردازش درخواست کد دعوت:', error);
      return {
        success: false,
        message: 'خطا در ارسال درخواست'
      };
    }
  }

  // ارسال ایمیل به ادمین
  private async sendEmailToAdmin(requestData: { 
    name: string; 
    fatherName: string; 
    email: string; 
    phone?: string; 
    message?: string; 
  }): Promise<void> {
    // در اینجا می‌توانید از سرویس ایمیل واقعی استفاده کنید
    // فعلاً فقط در کنسول نمایش می‌دهیم
    
    const emailContent = `
درخواست کد دعوت جدید دریافت شد:

اطلاعات درخواست‌کننده:
- نام: ${requestData.name}
- نام پدر: ${requestData.fatherName}
- ایمیل: ${requestData.email}
- شماره تماس: ${requestData.phone || 'ارسال نشده'}
- پیام اضافی: ${requestData.message || 'ندارد'}

تاریخ درخواست: ${new Date().toLocaleString('fa-IR')}

لطفاً این درخواست را بررسی کرده و در صورت تأیید، کد دعوت را برای ${requestData.email} ارسال کنید.

---
سیستم مدیریت اعضای خانواده
    `;

    console.log('📧 ایمیل برای ادمین:');
    console.log(emailContent);
    
    // TODO: در اینجا می‌توانید از سرویس‌های ایمیل واقعی استفاده کنید:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Nodemailer
  }

  // ثبت‌نام با کد دعوت، ایمیل و رمز عبور (بدون ایجاد عضو جدید)
  async registerWithInviteCodeAndCredentials(registrationData: {
    inviteCode: string;
    name: string;
    family_name: string;
    fatherName: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<{ success: boolean; message: string; member?: FamilyMember }> {
    try {
      // پیدا کردن عضو متناظر با کد دعوت
      const member = await this.findByInviteCode(registrationData.inviteCode);
      if (!member) {
        return { success: false, message: 'کد دعوت نامعتبر است' };
      }

      // جلوگیری از تکراری بودن ایمیل در جدول کاربران
      const existingUserByEmail = await this.userRepository.findOne({ where: { email: registrationData.email } });
      if (existingUserByEmail) {
        return { success: false, message: 'این ایمیل قبلاً ثبت شده است' };
      }

      // جلوگیری از ساخت حساب تکراری برای همین عضو
      const existingUserByMember = await this.userRepository.findOne({ where: { member: { id: member.id } }, relations: ['member'] });
      if (existingUserByMember) {
        return { success: false, message: 'برای این عضو قبلاً حساب کاربری ساخته شده است' };
      }

      // Hash کردن رمز عبور
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(registrationData.password, saltRounds);

      // ساخت کاربر جدید و اتصال به عضو موجود
      const { otp, expiresAt } = this.generateOtp(6, 10); // 6 رقم، اعتبار 10 دقیقه
      const now = new Date();
      const user = this.userRepository.create({
        email: registrationData.email,
        password: hashedPassword,
        is_verified: false,
        member: { id: member.id } as any,
        otp_code: otp,
        otp_expires_at: expiresAt,
        otp_attempts: 0,
        otp_last_sent_at: now,
      });

      await this.userRepository.save(user);

      // ارسال OTP (شبیه‌سازی ایمیل)
      await this.emailService.sendOtpEmail({ to: user.email, name: member.name, otp: user.otp_code!, expiresAt: user.otp_expires_at ?? undefined });

      return { success: true, message: 'کد تأیید ارسال شد', member };
    } catch (error) {
      console.error('خطا در ثبت‌نام:', error);
      return { success: false, message: 'خطا در ثبت‌نام' };
    }
  }

  // ورود با ایمیل و رمز عبور
  async loginWithCredentials(loginData: {
    email: string;
    password: string;
  }): Promise<{ success: boolean; message: string; member?: FamilyMember; token?: string }> {
    try {
      const user = await this.userRepository.findOne({ where: { email: loginData.email }, relations: ['member'] });
      if (!user) {
        return { success: false, message: 'ایمیل یا رمز عبور اشتباه است' };
      }

      const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
      if (!isPasswordValid) {
        return { success: false, message: 'ایمیل یا رمز عبور اشتباه است' };
      }

      const token = this.issueJwt({ userId: user.id, memberId: user.member?.id });
      return { success: true, message: 'ورود موفقیت‌آمیز', member: user.member, token };
    } catch (error) {
      console.error('خطا در ورود:', error);
      return { success: false, message: 'خطا در ورود' };
    }
  }

  // تأیید ایمیل
  async verifyEmail(userId: number): Promise<{ success: boolean; message: string }> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        return { success: false, message: 'کاربر یافت نشد' };
      }
      user.is_verified = true;
      await this.userRepository.save(user);
      return { success: true, message: 'ایمیل با موفقیت تأیید شد' };
    } catch (error) {
      console.error('خطا در تأیید ایمیل:', error);
      return { success: false, message: 'خطا در تأیید ایمیل' };
    }
  }

  // ارسال ایمیل تأیید (شبیه‌سازی)
  private async sendVerificationEmailToUser(user: User, member: FamilyMember): Promise<void> {
    const verificationLink = `http://localhost:3001/verify-email/${user.id}`;
    const emailContent = `
سلام ${member.name} عزیز،

ثبت‌نام شما در سیستم مدیریت اعضای خانواده با موفقیت انجام شد.

برای تأیید ایمیل خود، روی لینک زیر کلیک کنید:
${verificationLink}

اطلاعات حساب شما:
- نام: ${member.name}
- نام پدر: ${member.father_name}
- ایمیل: ${user.email}
- کد دعوت شما: ${member.invite_code}

با تشکر
سیستم مدیریت اعضای خانواده
    `;

    console.log('📧 ایمیل تأیید برای:', user.email);
    console.log(emailContent);
  }

  // تولید OTP با طول و دقیقه اعتبار
  private generateOtp(length: number, validMinutes: number): { otp: string; expiresAt: Date } {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    const expiresAt = new Date(Date.now() + validMinutes * 60 * 1000);
    return { otp: code, expiresAt };
  }

  // ارسال ایمیل OTP (شبیه‌سازی)
  // حذف: ارسال OTP داخلی، از EmailService استفاده می‌شود

  // تأیید OTP
  async verifyOtp(data: { email: string; otp: string }): Promise<{ success: boolean; message: string; token?: string }> {
    const user = await this.userRepository.findOne({ where: { email: data.email } });
    if (!user) return { success: false, message: 'کاربر یافت نشد' };
    if (!user.otp_code || !user.otp_expires_at) return { success: false, message: 'کد معتبر نیست' };
    if (new Date() > user.otp_expires_at) return { success: false, message: 'کد منقضی شده است' };
    if (user.otp_attempts >= 5) return { success: false, message: 'تعداد تلاش‌ها بیش از حد مجاز است' };

    if (user.otp_code !== data.otp) {
      user.otp_attempts += 1;
      await this.userRepository.save(user);
      return { success: false, message: 'کد نادرست است' };
    }

    // موفق: پاک‌سازی OTP و فعال‌سازی کاربر
    user.is_verified = true;
    user.otp_code = null;
    user.otp_expires_at = null;
    user.otp_attempts = 0;
    user.otp_last_sent_at = null;
    await this.userRepository.save(user);
    const token = this.issueJwt({ userId: user.id, memberId: user.member?.id });
    return { success: true, message: 'حساب کاربری با موفقیت فعال شد', token } as any;
  }

  // ارسال مجدد OTP با کول‌داون 60 ثانیه
  async resendOtp(data: { email: string }): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findOne({ where: { email: data.email }, relations: ['member'] });
    if (!user) return { success: false, message: 'کاربر یافت نشد' };
    const now = new Date();
    if (user.otp_last_sent_at && now.getTime() - user.otp_last_sent_at.getTime() < 60 * 1000) {
      return { success: false, message: 'لطفاً کمی بعد دوباره تلاش کنید' };
    }
    const { otp, expiresAt } = this.generateOtp(6, 10);
    user.otp_code = otp;
    user.otp_expires_at = expiresAt;
    user.otp_attempts = 0;
    user.otp_last_sent_at = now;
    await this.userRepository.save(user);
    const member = user.member || (await this.familyMemberRepository.findOne({ where: { id: (user as any).member?.id } }))!;
    await this.emailService.sendOtpEmail({ to: user.email, name: member.name, otp: user.otp_code!, expiresAt: user.otp_expires_at ?? undefined });
    return { success: true, message: 'کد تأیید ارسال شد' };
  }

  private issueJwt(payload: { userId: number; memberId?: number }): string {
    const secret = this.configService.get<string>('jwt.secret') as string;
    const expiresInEnv = this.configService.get<string>('jwt.expiresIn') as string;
    const options: SignOptions = { expiresIn: expiresInEnv as any };
    return jwt.sign(payload as any, secret, options);
  }

  // ============= Users management (Admin) =============
  async listUsers(): Promise<Array<User & { member?: FamilyMember }>> {
    return this.userRepository.find({ relations: ['member'] });
  }

  async getUserById(id: number): Promise<(User & { member?: FamilyMember }) | null> {
    return this.userRepository.findOne({ where: { id }, relations: ['member'] });
  }

  async setUserVerified(id: number, isVerified: boolean): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return { success: false, message: 'کاربر یافت نشد' };
    user.is_verified = isVerified;
    await this.userRepository.save(user);
    return { success: true, message: isVerified ? 'کاربر فعال شد' : 'کاربر غیرفعال شد' };
  }

  async deleteUser(id: number): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return { success: false, message: 'کاربر یافت نشد' };
    await this.userRepository.delete(id);
    return { success: true, message: 'کاربر حذف شد' };
  }

  // جستجوی اعضا
  async searchMembers(query: string): Promise<FamilyMember[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      const members = await this.familyMemberRepository
        .createQueryBuilder('member')
        .where('member.name ILIKE :query', { query: `%${query}%` })
        .orWhere('member.father_name ILIKE :query', { query: `%${query}%` })
        .orderBy('member.name', 'ASC')
        .limit(20)
        .getMany();

      return members;
    } catch (error) {
      console.error('خطا در جستجوی اعضا:', error);
      return [];
    }
  }
}
