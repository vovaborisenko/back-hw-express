import nodemailer from 'nodemailer';
import { SETTINGS } from '../../core/settings/settings';
import { injectable } from 'inversify';

@injectable()
export class EmailService {
  async sendEmail(
    toEmail: string,
    html: string,
    subject: string,
  ): Promise<boolean> {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SETTINGS.EMAIL,
        pass: SETTINGS.EMAIL_PASSWORD,
      },
    });

    const info = await transport.sendMail({
      from: `"${SETTINGS.EMAIL_NAME}" <${SETTINGS.EMAIL}>`,
      to: toEmail,
      subject,
      html,
    });

    return !!info;
  }
}
