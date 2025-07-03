import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'body73297@gmail.com',
      pass: 'cywm svup iuqf tybf',
    },
  });

  async sendMail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
  }
}
