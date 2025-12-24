import * as postmark from 'postmark';
import { ReferralEmailRepository } from '../repository/referral-email-repository';
import { useDB } from '../utils/db';
import { env } from '../utils/env';
import { logger } from '../lib/logger';
import { renderEmailTemplate } from '../utils/email-templates';

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
    referral: any,
    referralType: string,
    pdfBuffer: Buffer,
    pdfFileId: number
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
      const tag = 'referral-notification';
      const subject = `${referralType} Referral`;

      // Render email template with referral data
      const emailContent = await renderEmailTemplate('new-referral', {
        first_name: referral.first_name,
        last_name: referral.last_name,
        referral_date: referral.referred_at
          ? new Date(referral.referred_at).toLocaleDateString()
          : new Date().toLocaleDateString(),
        referral_id: referral.id,
      });

      const response = await this.client.sendEmail({
        From: fromEmail,
        To: toEmail,
        Subject: subject,
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
        referral_id: parseInt(referral.id),
        from_email: fromEmail,
        recipient_email: toEmail,
        message_id: response.MessageID,
        status: 'sent',
        tag,
        subject,
        email_content: emailContent,
        file_id: pdfFileId,
      });
    } catch (error) {
      logger.error('Error sending notification email via Postmark', { error });
      throw error;
    }

    // Send confirmation email to client if email is provided
    if (referral.email) {
      try {
        const tag = 'referral-confirmation';
        const subject = `${referralType} Referral Confirmation`;

        // Render confirmation template
        const confirmationContent = await renderEmailTemplate('referral-confirmation', {
          year: new Date().getFullYear(),
        });

        const clientResponse = await this.client.sendEmail({
          From: fromEmail,
          To: referral.email,
          Subject: subject,
          MessageStream: 'outbound',
          HtmlBody: confirmationContent,
          Tag: tag,
        });

        logger.info('Referral confirmation email sent to client', {
          messageId: clientResponse.MessageID,
        });

        // Log the client confirmation email to database
        await emailRepository.create({
          referral_id: parseInt(referral.id),
          from_email: fromEmail,
          recipient_email: referral.email,
          message_id: clientResponse.MessageID,
          status: 'sent',
          tag,
          subject,
          email_content: confirmationContent,
          file_id: null, // Confirmation email doesn't include PDF
        });
      } catch (error) {
        logger.error('Error sending confirmation email via Postmark', { error });
        // Don't throw here - main notification was successful
      }
    }
  }

  /**
   * Resend referral PDF to a specific email address
   */
  async resendReferralPDF(
    referral: any,
    referralType: string,
    pdfBuffer: Buffer,
    recipientEmail: string
  ): Promise<void> {
    if (!this.client) {
      throw new Error('Postmark client not initialized. Skipping email.');
    }

    const fromEmail = env.EMAIL_FROM;
    const db = useDB();
    const emailRepository = new ReferralEmailRepository(db);

    try {
      const tag = 'referral-resend';
      // Use a simple hardcoded subject for now to debug
      const subject = `${referralType} Referral`;

      // Validate parameters
      logger.info('Preparing to resend referral PDF', {
        referralId: referral.id,
        referralType,
        subject,
        subjectLength: subject.length,
        recipientEmail,
        pdfBufferLength: pdfBuffer.length,
      });

      // Validate subject length (should never hit this but just in case)
      if (subject.length > 2000) {
        throw new Error(`Subject too long: ${subject.length} characters`);
      }

      // Render email template with referral data
      const emailContent = await renderEmailTemplate('new-referral', {
        first_name: referral.first_name,
        last_name: referral.last_name,
        referral_date: referral.referred_at
          ? new Date(referral.referred_at).toLocaleDateString()
          : new Date().toLocaleDateString(),
        referral_id: referral.id,
      });

      // Log the email data right before sending
      logger.info('Sending email via Postmark', {
        from: fromEmail,
        to: recipientEmail,
        subject,
        subjectType: typeof subject,
        contentLength: emailContent?.length || 0,
      });

      const response = await this.client.sendEmail({
        From: fromEmail,
        To: recipientEmail,
        Subject: subject,
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

      logger.info('Referral PDF resent via Postmark', {
        messageId: response.MessageID,
        recipient: recipientEmail,
      });

      // Log the email to database
      await emailRepository.create({
        referral_id: parseInt(referral.id),
        from_email: fromEmail,
        recipient_email: recipientEmail,
        message_id: response.MessageID,
        status: 'sent',
        tag,
        subject,
        email_content: emailContent,
        file_id: null, // For resend, we don't link to a specific file record
      });
    } catch (error) {
      logger.error('Error resending PDF email via Postmark', { error });
      throw error;
    }
  }
}

export const emailService = new EmailService();
