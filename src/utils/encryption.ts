// =====================================================
// ENCRYPTION UTILITY
// =====================================================
// Client-side encryption for sensitive data like AI credentials
// Uses Web Crypto API (AES-GCM) for secure encryption

/**
 * Encrypts data using AES-GCM with a user-specific key
 * @param data - The data to encrypt (will be JSON stringified)
 * @param userId - User ID to derive encryption key
 * @returns Base64 encoded encrypted data with IV
 */
export async function encryptData(data: any, userId: string): Promise<string> {
  try {
    // Convert data to string
    const dataString = JSON.stringify(data);
    const dataBuffer = new TextEncoder().encode(dataString);

    // Derive encryption key from user ID
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(userId.padEnd(32, '0')), // Ensure 32 bytes
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('mermaid-studio-salt'),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encrypt data
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);

    // Convert to base64
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts data encrypted with encryptData
 * @param encryptedData - Base64 encoded encrypted data
 * @param userId - User ID to derive decryption key
 * @returns Decrypted data (parsed from JSON)
 */
export async function decryptData(encryptedData: string, userId: string): Promise<any> {
  try {
    // Decode base64
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encryptedBuffer = combined.slice(12);

    // Derive decryption key from user ID
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(userId.padEnd(32, '0')),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('mermaid-studio-salt'),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    // Decrypt data
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedBuffer
    );

    // Convert to string and parse JSON
    const dataString = new TextDecoder().decode(decryptedBuffer);
    return JSON.parse(dataString);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Checks if data is encrypted (base64 format)
 */
export function isEncrypted(data: any): boolean {
  if (typeof data !== 'string') return false;
  try {
    // Try to decode as base64
    atob(data);
    return true;
  } catch {
    return false;
  }
}
