import { Injectable } from '@nestjs/common';
import { EmailService } from './services/email.service';

@Injectable()
export class EmailServiceAdapter {
    constructor(private readonly emailService: EmailService) { }

    async sendEmail(recipient: string, subject: string, body: string): Promise<void> {
        // Perform necessary transformations or mappings if needed
        await this.emailService.sendEmail(recipient, subject, body);
    }
}
