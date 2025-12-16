import PDFDocument from 'pdfkit';
import { Referral } from '../types/referral-types';
import { formatDate } from '../../utils/dateTimeUtils';

export class PDFService {
  generateReferralPDF(referral: Referral): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const isProfessional = referral.referral_type === 'professional';

      // Set font
      doc.fontSize(11);
      doc.font('Helvetica-Bold');

      // Add header image if it exists
      try {
        doc.image('public/images/header.png', 50, 10, { width: 500 });
        doc.text('  ');
        doc.text('  ');
        doc.text('  ');
        doc.text('  ');
        doc.text('  ');
        doc.text('  ');
      } catch (error) {
        // Header image not found, skip
        doc.text('  ');
        doc.text('  ');
      }

      // Calculate age
      let age = 'N/A';
      if (referral.date_of_birth) {
        const dob = new Date(referral.date_of_birth);
        age = Math.floor(
          (new Date().getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
        ).toString();
      }

      if (isProfessional) {
        doc.text('Professional Referral Form (Referral Information)');
        doc.text('  ');
        doc.text(`Client's Name: ${referral.first_name} ${referral.last_name}`);
        doc.text('  ');
        if (referral.date_of_birth) {
          doc.text(`Date of Birth: ${formatDate(referral.date_of_birth)}`);
          doc.text('  ');
        }
        doc.text(`Chronological Age: ${age}`);
        doc.text('  ');
        if (referral.parents_guardians) {
          doc.text(`Parents/Guardians: ${referral.parents_guardians}`);
          doc.text('  ');
        }
        if (referral.referrer_name) {
          doc.text(`Referral Source: ${referral.referrer_name}`);
          doc.text('  ');
        }
        doc.text(
          `Date of Referral: ${
            referral.referred_at ? formatDate(referral.referred_at) : formatDate(new Date())
          }`
        );
        doc.text('  ');
        if (referral.referrer_email) {
          doc.text(`Referral Source Email Address: ${referral.referrer_email}`);
          doc.text('  ');
        }
        doc.text(
          `Does the referrer prefer to speak with Dr. Hann before we contact the client? ${
            referral.referrer_prefers_contact ? 'Yes' : 'No'
          }`
        );
        doc.text('  ');
        if (referral.referrer_relationship) {
          doc.text(`Designation/Relationship to Client: ${referral.referrer_relationship}`);
          doc.text('  ');
        }
        if (referral.method_of_payment) {
          doc.text(`Method of Payment: ${referral.method_of_payment}`);
          doc.text('  ');
        }
        // Display address information
        const hasAddress =
          referral.address_1 ||
          referral.city ||
          referral.province_state ||
          referral.country ||
          referral.postal_zip;
        const hasLegacyAddress = referral.mailing_address;

        if (hasAddress) {
          doc.text('Mailing Address:');
          if (referral.address_1) {
            doc.text(referral.address_1);
          }
          if (referral.address_2) {
            doc.text(referral.address_2);
          }
          const cityStateZip = [referral.city, referral.province_state, referral.postal_zip]
            .filter(Boolean)
            .join(', ');
          if (cityStateZip) {
            doc.text(cityStateZip);
          }
          if (referral.country) {
            doc.text(referral.country);
          }
          doc.text('  ');
        } else if (hasLegacyAddress && referral.mailing_address) {
          doc.text('Mailing Address:');
          const addressLines = referral.mailing_address.split('\n');
          addressLines.forEach((line) => {
            if (line.trim()) {
              doc.text(line.trim());
            }
          });
          doc.text('  ');
        }
        if (referral.email) {
          doc.text(`Email: ${referral.email}`);
          doc.text('  ');
        }
        doc.text(`Contact Numbers: ${referral.primary_telephone}`);
        if (referral.secondary_telephone) {
          doc.text(`Secondary: ${referral.secondary_telephone}`);
        }
        doc.text('  ');
        if (referral.presenting_issues) {
          doc.text('Concerns:');
          const concernLines = referral.presenting_issues.split('\n');
          concernLines.forEach((line) => {
            if (line.trim()) {
              doc.text(line.trim());
            }
          });
          doc.text('  ');
        }
        doc.text(`Service Requested: ${referral.requested_service}`);
        doc.text('  ');
      } else {
        // Self-referral
        doc.text('Self Referral Form (Referral Information)');
        doc.text('  ');
        doc.text(`Chronological Age: ${age}`);
        doc.text('  ');
        doc.text(
          `Date of Referral: ${
            referral.referred_at ? formatDate(referral.referred_at) : formatDate(new Date())
          }`
        );
        doc.text('  ');
        doc.text(`Client's Name: ${referral.first_name} ${referral.last_name}`);
        doc.text('  ');
        if (referral.date_of_birth) {
          doc.text(`Date of Birth: ${formatDate(referral.date_of_birth)}`);
          doc.text('  ');
        }
        if (referral.parents_guardians) {
          doc.text(`Parents (Guardians) Names: ${referral.parents_guardians}`);
          doc.text('  ');
        }
        doc.text(`Primary Telephone: ${referral.primary_telephone}`);
        doc.text('  ');
        if (referral.secondary_telephone) {
          doc.text(`Secondary Telephone: ${referral.secondary_telephone}`);
          doc.text('  ');
        }
        if (referral.email) {
          doc.text(`Email: ${referral.email}`);
          doc.text('  ');
        }
        // Display address information
        const hasAddress =
          referral.address_1 ||
          referral.city ||
          referral.province_state ||
          referral.country ||
          referral.postal_zip;
        const hasLegacyAddress = referral.mailing_address;

        if (hasAddress) {
          doc.text('Mailing Address:');
          if (referral.address_1) {
            doc.text(referral.address_1);
          }
          if (referral.address_2) {
            doc.text(referral.address_2);
          }
          const cityStateZip = [referral.city, referral.province_state, referral.postal_zip]
            .filter(Boolean)
            .join(', ');
          if (cityStateZip) {
            doc.text(cityStateZip);
          }
          if (referral.country) {
            doc.text(referral.country);
          }
          doc.text('  ');
        } else if (hasLegacyAddress && referral.mailing_address) {
          doc.text('Mailing Address:');
          const addressLines = referral.mailing_address.split('\n');
          addressLines.forEach((line) => {
            if (line.trim()) {
              doc.text(line.trim());
            }
          });
          doc.text('  ');
        }
        doc.text(`Service Requested: ${referral.requested_service}`);
        doc.text('  ');
        if (referral.presenting_issues) {
          doc.text('Concerns:');
          const concernLines = referral.presenting_issues.split('\n');
          concernLines.forEach((line) => {
            if (line.trim()) {
              doc.text(line.trim());
            }
          });
          doc.text('  ');
        }
      }

      doc.end();
    });
  }
}

export const pdfService = new PDFService();
