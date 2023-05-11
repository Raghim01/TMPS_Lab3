import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
    async sendEmail(recipient: string, subject: string, body: string): Promise<void> {
        // Implementation of the email sending functionality using a third-party library or API
        // You would typically use an external library or API to send the email here
        console.log(`Sending email to ${recipient}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${body}`);
        // Code to send the email...
        console.log('Email sent!');
    }
}
