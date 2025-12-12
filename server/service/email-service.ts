import * as postmark from 'postmark';
import { ReferralEmailRepository } from '../repository/referral-email-repository';
import { useDB } from '../utils/db';
import { env } from '../utils/env';
import { logger } from '../lib/logger';

export class EmailService {
  private client: postmark.ServerClient | null = null;

  constructor() {
    if (env.POSTMARK_SERVER_API_TOKEN) {
      this.client = new postmark.ServerClient(env.POSTMARK_SERVER_API_TOKEN);
    } else {
      logger.warn('POSTMARK_SERVER_API_TOKEN not configured. Email sending will be disabled.');
    }
  }

  async sendReferralNotification(
    referralId: string,
    referralType: string,
    pdfBuffer: Buffer,
    pdfFileId: number,
    clientEmail?: string | null
  ): Promise<void> {
    if (!this.client) {
      logger.warn('Postmark client not initialized. Skipping email.');
      return;
    }

    const fromEmail = env.EMAIL_FROM;
    const toEmail = env.EMAIL_TO;

    const db = useDB();
    const emailRepository = new ReferralEmailRepository(db);

    // Send email with PDF attachment to admin
    try {
      const emailContent = `<h2>New Referral</h2><p>A new ${referralType} referral has been submitted.</p>`;
      const tag = 'referral-notification';

      const response = await this.client.sendEmail({
        From: fromEmail,
        To: toEmail,
        Subject: `${referralType} Referral`,
        MessageStream: 'outbound',
        HtmlBody: emailContent,
        Attachments: [
          {
            ContentID: 'referral.pdf',
            Content: pdfBuffer.toString('base64'),
            Name: 'referral.pdf',
            ContentType: 'application/pdf',
          },
        ],
        Tag: tag,
      });

      logger.info('Referral notification email sent via Postmark', {
        messageId: response.MessageID,
      });

      // Log the email to database
      await emailRepository.create({
        referral_id: parseInt(referralId),
        from_email: fromEmail,
        recipient_email: toEmail,
        message_id: response.MessageID,
        status: 'sent',
        tag,
        subject: `${referralType} Referral`,
        email_content: emailContent,
        file_id: pdfFileId,
      });
    } catch (error) {
      logger.error('Error sending notification email via Postmark', { error });
      throw error;
    }

    // Send confirmation email to client if email is provided
    if (clientEmail) {
      try {
        const confirmationContent =
          '<h2>Thank you</h2><p>We have received your referral and will contact you shortly. If you have any questions please email info@hannpsychologicalservices.com</p>';

        const tag = 'referral-confirmation';

        const clientResponse = await this.client.sendEmail({
          From: fromEmail,
          To: clientEmail,
          Subject: `${referralType} Referral Confirmation`,
          MessageStream: 'outbound',
          HtmlBody: confirmationContent,
          Tag: tag,
        });

        logger.info('Referral confirmation email sent to client', {
          messageId: clientResponse.MessageID,
        });

        // Log the client confirmation email to database
        await emailRepository.create({
          referral_id: parseInt(referralId),
          from_email: fromEmail,
          recipient_email: clientEmail,
          message_id: clientResponse.MessageID,
          status: 'sent',
          tag,
          subject: `${referralType} Referral Confirmation`,
          email_content: confirmationContent,
          file_id: null, // Confirmation email doesn't include PDF
        });
      } catch (error) {
        logger.error('Error sending confirmation email via Postmark', { error });
        // Don't throw here - main notification was successful
      }
    }
  }
}

export const emailService = new EmailService();
