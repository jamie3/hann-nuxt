import * as postmark from 'postmark';

export class EmailService {
  private client: postmark.ServerClient | null = null;

  constructor() {
    const apiToken = process.env.POSTMARK_SERVER_API_TOKEN;
    if (apiToken) {
      this.client = new postmark.ServerClient(apiToken);
    } else {
      console.warn('POSTMARK_SERVER_API_TOKEN not configured. Email sending will be disabled.');
    }
  }

  async sendReferralNotification(
    referralType: string,
    pdfBuffer: Buffer,
    clientEmail?: string | null
  ): Promise<void> {
    if (!this.client) {
      console.warn('Postmark client not initialized. Skipping email.');
      return;
    }

    const fromEmail = process.env.EMAIL_FROM || 'noreply@hannpsychologicalservices.com';
    const toEmail = process.env.EMAIL_TO || 'info@hannpsychologicalservices.com';

    // Send email with PDF attachment to admin
    try {
      const response = await this.client.sendEmail({
        From: fromEmail,
        To: toEmail,
        Subject: `${referralType} Referral`,
        MessageStream: 'outbound',
        HtmlBody: `<h2>New Referral</h2><p>A new ${referralType} referral has been submitted.</p>`,
        Attachments: [
          {
            ContentID: 'referral.pdf',
            Content: pdfBuffer.toString('base64'),
            Name: 'referral.pdf',
            ContentType: 'application/pdf',
          },
        ],
      });

      console.log('Email sent via Postmark:', response.MessageID);
    } catch (error) {
      console.error('Error sending notification email via Postmark:', error);
      throw error;
    }

    // Send confirmation email to client if email is provided
    if (clientEmail) {
      try {
        const clientResponse = await this.client.sendEmail({
          From: fromEmail,
          To: clientEmail,
          Subject: `${referralType} Referral`,
          MessageStream: 'outbound',
          HtmlBody:
            '<h2>Thank you</h2><p>We have received your referral and will contact you shortly. If you have any questions please email info@hannpsychologicalservices.com</p>',
        });

        console.log('Confirmation email sent to client via Postmark:', clientResponse.MessageID);
      } catch (error) {
        console.error('Error sending confirmation email via Postmark:', error);
        // Don't throw here - main notification was successful
      }
    }
  }
}

export const emailService = new EmailService();
