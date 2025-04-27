import bcrypt from 'bcrypt';

// Number of salt rounds for bcrypt
// Higher is more secure but slower (10-12 is generally recommended)
const SALT_ROUNDS = 12;

/**
 * Hashes a password using bcrypt with appropriate salt rounds
 * @param plainPassword The plain text password to hash
 * @returns A promise that resolves to the hashed password
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
}

/**
 * Compares a plain text password with a hashed password
 * @param plainPassword The plain text password to check
 * @param hashedPassword The hashed password to compare against
 * @returns A promise that resolves to true if the passwords match, false otherwise
 */
export async function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
}