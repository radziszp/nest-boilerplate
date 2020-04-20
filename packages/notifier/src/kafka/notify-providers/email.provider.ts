import { Injectable } from '@nestjs/common';
import { NotifyData, NotifyProvider } from '../interfaces';
import * as nodemailer from 'nodemailer';
import { configuration } from '../../config/config';

@Injectable()
export class EmailProvider implements NotifyProvider {
  async send(data: NotifyData) {
    const transporter = this.createTransport()

    return transporter.sendMail({
      from: configuration.mailer.from,
      to: data.user.email,
      subject: data.data.subject,
      text: data.data.message,
    });
  }

  createTransport() {
    const { host, port, secure, username, password } = configuration.mailer;
    return nodemailer.createTransport({
      host: host,
      port: port,
      secure: secure,
      auth: {
        user: username,
        pass: password,
      },
    });
  }
}
