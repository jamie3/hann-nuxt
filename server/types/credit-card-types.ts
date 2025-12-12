/**
 * Credit Card Types
 */

// Database row type
export interface CreditCardRow {
  id: number;
  referral_id: number;
  card_number_encrypted: string;
  expiry_encrypted: string;
  cvv_encrypted: string | null;
  created_at: Date;
  updated_at: Date;
}

// Domain model (with decrypted values)
export interface CreditCard {
  id: string;
  referral_id: string;
  card_number: string; // Decrypted
  card_number_masked: string; // Masked for display
  expiry: string; // Decrypted
  cvv?: string; // Decrypted (optional)
  created_at: string;
  updated_at: string;
}

// For creating a new credit card
export interface NewCreditCard {
  referral_id: string;
  card_number: string;
  expiry: string; // Format: MM/YY
  cvv?: string; // Optional
}

// Database insert type
export interface CreditCardInsert {
  referral_id: number;
  card_number_encrypted: string;
  expiry_encrypted: string;
  cvv_encrypted?: string;
}

// Database update type
export interface CreditCardUpdate {
  card_number_encrypted?: string;
  expiry_encrypted?: string;
  cvv_encrypted?: string;
}
