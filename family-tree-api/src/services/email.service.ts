import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private fromAddress: string;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('email.host');
    const port = this.configService.get<number>('email.port');
    const user = this.configService.get<string>('email.user');
    const pass = this.configService.get<string>('email.pass');
    this.fromAddress = this.configService.get<string>('email.from') || 'noreply@example.com';

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
    });
  }

  async sendMail(options: { to: string; subject: string; text?: string; html?: string }) {
    return this.transporter.sendMail({ from: this.fromAddress, ...options });
  }

  async sendOtpEmail(options: { to: string; name: string; otp: string; expiresAt?: Date }) {
    const { to, name, otp, expiresAt } = options;
    const subject = 'کد تأیید ورود/ثبت‌نام';
    const expires = expiresAt ? expiresAt.toLocaleString('fa-IR') : '';
    const text = `سلام ${name} عزیز،\n\nکد تأیید شما: ${otp}\nاعتبار تا: ${expires}\n\nاگر شما درخواست نداده‌اید این پیام را نادیده بگیرید.`;
    const html = `
      <div style="font-family:Tahoma,Arial,sans-serif;font-size:14px;direction:rtl;text-align:right">
        <p>سلام ${name} عزیز،</p>
        <p>کد تأیید شما:</p>
        <p style="font-size:22px;font-weight:bold;letter-spacing:3px">${otp}</p>
        ${expires ? `<p>اعتبار تا: ${expires}</p>` : ''}
        <p>اگر شما درخواست نداده‌اید این پیام را نادیده بگیرید.</p>
      </div>
    `;
    await this.sendMail({ to, subject, text, html });
    console.log('🔐 OTP:', otp, '| 📧 to:', to, '| ⏰ expires:', expires || '-');
  }
}


