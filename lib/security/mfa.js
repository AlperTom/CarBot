import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

/**
 * Multi-Factor Authentication (MFA) implementation
 * Supports TOTP (Time-based One-Time Password) and SMS backup codes
 */
export class MFAManager {
  constructor() {
    this.algorithm = 'sha256';
    this.digits = 6;
    this.period = 30; // 30 seconds
    this.window = 1; // Allow 1 period before/after for time drift
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }

  /**
   * Generate a cryptographically secure secret for TOTP
   * @returns {string} Base32-encoded secret
   */
  generateSecret() {
    const buffer = crypto.randomBytes(20);
    return this.base32Encode(buffer);
  }

  /**
   * Base32 encoding implementation
   * @param {Buffer} buffer - Buffer to encode
   * @returns {string} Base32-encoded string
   */
  base32Encode(buffer) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    let bits = 0;
    let value = 0;

    for (let i = 0; i < buffer.length; i++) {
      value = (value << 8) | buffer[i];
      bits += 8;

      while (bits >= 5) {
        result += alphabet[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }

    if (bits > 0) {
      result += alphabet[(value << (5 - bits)) & 31];
    }

    return result;
  }

  /**
   * Base32 decoding implementation
   * @param {string} encoded - Base32-encoded string
   * @returns {Buffer} Decoded buffer
   */
  base32Decode(encoded) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const lookup = {};
    for (let i = 0; i < alphabet.length; i++) {
      lookup[alphabet[i]] = i;
    }

    encoded = encoded.toUpperCase().replace(/[=]/g, '');
    let bits = 0;
    let value = 0;
    let result = [];

    for (let i = 0; i < encoded.length; i++) {
      const char = encoded[i];
      if (!(char in lookup)) {
        throw new Error(`Invalid character in base32: ${char}`);
      }

      value = (value << 5) | lookup[char];
      bits += 5;

      if (bits >= 8) {
        result.push((value >>> (bits - 8)) & 255);
        bits -= 8;
      }
    }

    return Buffer.from(result);
  }

  /**
   * Generate TOTP code for given secret and time
   * @param {string} secret - Base32-encoded secret
   * @param {number} time - Time in seconds (default: current time)
   * @returns {string} 6-digit TOTP code
   */
  generateTOTP(secret, time = null) {
    if (!time) {
      time = Math.floor(Date.now() / 1000);
    }

    const counter = Math.floor(time / this.period);
    const secretBuffer = this.base32Decode(secret);
    
    // Create HMAC
    const hmac = crypto.createHmac(this.algorithm, secretBuffer);
    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeUInt32BE(0, 0);
    counterBuffer.writeUInt32BE(counter, 4);
    
    const digest = hmac.update(counterBuffer).digest();
    
    // Dynamic truncation
    const offset = digest[digest.length - 1] & 0x0f;
    const code = ((digest[offset] & 0x7f) << 24) |
                 ((digest[offset + 1] & 0xff) << 16) |
                 ((digest[offset + 2] & 0xff) << 8) |
                 (digest[offset + 3] & 0xff);
    
    return (code % Math.pow(10, this.digits)).toString().padStart(this.digits, '0');
  }

  /**
   * Verify TOTP code
   * @param {string} token - User-provided TOTP token
   * @param {string} secret - Base32-encoded secret
   * @param {number} window - Time window for verification
   * @returns {boolean} True if token is valid
   */
  verifyTOTP(token, secret, window = this.window) {
    const currentTime = Math.floor(Date.now() / 1000);
    
    for (let i = -window; i <= window; i++) {
      const testTime = currentTime + (i * this.period);
      const expectedToken = this.generateTOTP(secret, testTime);
      
      if (crypto.timingSafeEqual(
        Buffer.from(token, 'utf8'),
        Buffer.from(expectedToken, 'utf8')
      )) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Generate QR code data for TOTP setup
   * @param {string} secret - Base32-encoded secret
   * @param {string} userEmail - User's email address
   * @param {string} issuer - Service name (default: CarBot)
   * @returns {string} QR code URL
   */
  generateQRCodeData(secret, userEmail, issuer = 'CarBot') {
    const params = new URLSearchParams({
      secret,
      issuer,
      algorithm: this.algorithm.toUpperCase(),
      digits: this.digits.toString(),
      period: this.period.toString()
    });

    return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(userEmail)}?${params.toString()}`;
  }

  /**
   * Enable MFA for a user
   * @param {string} userId - User ID
   * @param {string} secret - Base32-encoded secret
   * @param {string} verificationToken - User-provided verification token
   * @returns {Object} MFA setup result
   */
  async enableMFA(userId, secret, verificationToken) {
    try {
      // Verify the provided token
      if (!this.verifyTOTP(verificationToken, secret)) {
        throw new Error('Invalid verification token');
      }

      // Generate backup codes
      const backupCodes = this.generateBackupCodes();
      
      // Store MFA configuration in database
      const { data, error } = await this.supabase
        .from('user_mfa')
        .upsert({
          user_id: userId,
          secret_encrypted: secret, // In production, encrypt this
          backup_codes: backupCodes,
          enabled: true,
          setup_date: new Date().toISOString()
        });

      if (error) throw error;

      // Update user profile to indicate MFA is enabled
      await this.supabase
        .from('users')
        .update({ mfa_enabled: true })
        .eq('id', userId);

      return {
        success: true,
        backupCodes: backupCodes
      };
    } catch (error) {
      throw new Error(`Failed to enable MFA: ${error.message}`);
    }
  }

  /**
   * Verify MFA token during login
   * @param {string} userId - User ID
   * @param {string} token - User-provided token
   * @returns {boolean} True if token is valid
   */
  async verifyMFAToken(userId, token) {
    try {
      const { data, error } = await this.supabase
        .from('user_mfa')
        .select('secret_encrypted, backup_codes, enabled')
        .eq('user_id', userId)
        .eq('enabled', true)
        .single();

      if (error || !data) {
        return false;
      }

      // Check if it's a backup code
      if (data.backup_codes && data.backup_codes.includes(token)) {
        // Remove used backup code
        const updatedCodes = data.backup_codes.filter(code => code !== token);
        await this.supabase
          .from('user_mfa')
          .update({ backup_codes: updatedCodes })
          .eq('user_id', userId);
        
        return true;
      }

      // Verify TOTP token
      return this.verifyTOTP(token, data.secret_encrypted);
    } catch (error) {
      console.error('MFA verification error:', error);
      return false;
    }
  }

  /**
   * Generate backup codes for MFA
   * @param {number} count - Number of backup codes to generate
   * @returns {Array<string>} Array of backup codes
   */
  generateBackupCodes(count = 10) {
    const codes = [];
    for (let i = 0; i < count; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(`${code.slice(0, 4)}-${code.slice(4, 8)}`);
    }
    return codes;
  }

  /**
   * Disable MFA for a user
   * @param {string} userId - User ID
   * @param {string} verificationToken - User-provided verification token
   * @returns {boolean} True if MFA was successfully disabled
   */
  async disableMFA(userId, verificationToken) {
    try {
      // Verify current MFA token before disabling
      const isValid = await this.verifyMFAToken(userId, verificationToken);
      if (!isValid) {
        throw new Error('Invalid verification token');
      }

      // Disable MFA in database
      await this.supabase
        .from('user_mfa')
        .update({ enabled: false })
        .eq('user_id', userId);

      // Update user profile
      await this.supabase
        .from('users')
        .update({ mfa_enabled: false })
        .eq('id', userId);

      return true;
    } catch (error) {
      console.error('Failed to disable MFA:', error);
      return false;
    }
  }

  /**
   * Check if user has MFA enabled
   * @param {string} userId - User ID
   * @returns {boolean} True if MFA is enabled
   */
  async isMFAEnabled(userId) {
    try {
      const { data, error } = await this.supabase
        .from('user_mfa')
        .select('enabled')
        .eq('user_id', userId)
        .eq('enabled', true)
        .single();

      return !error && data && data.enabled;
    } catch (error) {
      console.error('Error checking MFA status:', error);
      return false;
    }
  }
}

export default new MFAManager();