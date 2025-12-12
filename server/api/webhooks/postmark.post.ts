import { ReferralEmailRepository } from '~/server/repository/referral-email-repository';
import { useDB } from '~/server/utils/db';
import { env } from '~/server/utils/env';
import { logger } from '~/server/lib/logger';

/**
 * Postmark Webhook Handler
 * Handles delivery, bounce, spam complaint, open, and click events
 *
 * Webhook types:
 * - Delivery: Email successfully delivered
 * - Bounce: Email bounced
 * - SpamComplaint: Recipient marked as spam
 * - Open: Recipient opened email
 * - Click: Recipient clicked link in email
 */
export default defineEventHandler(async (event) => {
  // Skip CSRF check for webhooks
  event.context.skipCsrf = true;

  try {
    // Verify API key from header (case-insensitive)
    const apiKey = getHeader(event, 'apikey') || getHeader(event, 'ApiKey');

    logger.info('Postmark webhook received', {
      hasApiKey: !!apiKey,
      expectedKeyConfigured: !!env.POSTMARK_WEBHOOK_API_KEY,
    });

    if (apiKey !== env.POSTMARK_WEBHOOK_API_KEY) {
      logger.warn('Invalid API key in Postmark webhook request', {
        receivedKey: apiKey,
      });
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      });
    }

    const body = await readBody(event);

    const { RecordType, MessageID, Recipient, Tag, DeliveredAt, BouncedAt, Details, Metadata } =
      body;

    if (!MessageID) {
      logger.error('Postmark webhook received without MessageID');
      return { success: false, message: 'MessageID is required' };
    }

    const db = useDB();
    const emailRepository = new ReferralEmailRepository(db);

    // Find existing email record
    let existingEmail = await emailRepository.findByMessageId(MessageID);

    // If no record exists, create one
    if (!existingEmail) {
      logger.info(`No email record found for MessageID: ${MessageID}, creating new record`);

      // Try to extract referral_id from metadata or use 0 as placeholder
      const referralId = Metadata?.referral_id || 0;

      const newEmailData: any = {
        referral_id: referralId,
        from_email: body.From || 'unknown@example.com',
        recipient_email: Recipient || 'unknown@example.com',
        message_id: MessageID,
        status: 'sent',
        record_type: RecordType,
        tag: Tag || null,
        metadata: Metadata || null,
      };

      existingEmail = await emailRepository.create(newEmailData);
      logger.info(`Created email record for MessageID: ${MessageID}`);
    }

    // Prepare update data based on webhook type
    const updateData: any = {
      record_type: RecordType,
      details: Details || existingEmail.details,
    };

    // Update status and timestamps based on webhook type
    switch (RecordType) {
      case 'Delivery':
        updateData.status = 'delivered';
        updateData.delivered_at = DeliveredAt ? new Date(DeliveredAt) : new Date();
        break;

      case 'Bounce':
        updateData.status = 'bounced';
        updateData.bounced_at = BouncedAt ? new Date(BouncedAt) : new Date();
        break;

      case 'SpamComplaint':
        updateData.status = 'spam_complaint';
        updateData.spam_complaint_at = new Date();
        break;

      case 'Open':
        // Only update if not already in a final state
        if (existingEmail.status !== 'bounced' && existingEmail.status !== 'spam_complaint') {
          updateData.status = 'opened';
        }
        updateData.opened_at = new Date();
        break;

      case 'Click':
        // Only update if not already in a final state
        if (existingEmail.status !== 'bounced' && existingEmail.status !== 'spam_complaint') {
          updateData.status = 'clicked';
        }
        updateData.clicked_at = new Date();
        break;

      default:
        logger.info(`Unknown Postmark webhook type: ${RecordType}`);
    }

    // Update the email record
    await emailRepository.updateFromWebhook(MessageID, updateData);

    logger.info(`Processed Postmark ${RecordType} webhook`, { messageId: MessageID });

    return {
      success: true,
      message: `${RecordType} webhook processed successfully`,
    };
  } catch (error: any) {
    logger.error('Error processing Postmark webhook', { error: error.message });

    // Return 200 to prevent Postmark from retrying
    return {
      success: false,
      message: error.message || 'Failed to process webhook',
    };
  }
});
