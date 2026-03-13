import { json, error, type RequestHandler } from '@sveltejs/kit';
import { generateId } from '$lib/auth/session';
import { sendEmail } from '$lib/email/resend';
import { generatePasswordResetEmail } from '$lib/email/templates/password-reset';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

// Generate a secure random token
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Hash token using SHA-256
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const POST: RequestHandler = async ({ request, locals, url }) => {
  try {
    const body = await request.json();
    
    // Validate input
    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) {
      throw error(400, { message: 'Invalid email address' });
    }

    const { email } = result.data;

    // Find user by email
    const user = await locals.db
      .selectFrom('users')
      .where('email', '=', email)
      .select(['id', 'name', 'password_hash'])
      .executeTakeFirst();

    // Don't reveal if user exists (security best practice)
    if (!user) {
      return json({
        success: true,
        message: 'Jika akun ada, instruksi reset password telah dikirim ke email Anda'
      });
    }

    // Check if user has a password (OAuth users might not have one)
    if (!user.password_hash) {
      return json({
        success: true,
        message: 'Akun ini menggunakan login Google. Silakan login dengan Google.'
      });
    }

    // Generate reset token
    const token = generateToken();
    const tokenHash = await hashToken(token);

    // Delete any existing unused tokens for this user
    await locals.db
      .deleteFrom('password_reset_tokens')
      .where('user_id', '=', user.id)
      .execute();

    // Create new reset token (expires in 1 hour)
    const expiresAt = Date.now() + 60 * 60 * 1000;

    await locals.db
      .insertInto('password_reset_tokens')
      .values({
        id: generateId(),
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: expiresAt,
        used: 0,
        created_at: Date.now()
      })
      .execute();

    // Send password reset email
    const resetUrl = `${url.origin}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    const emailTemplate = generatePasswordResetEmail({
      name: user.name || 'Pengguna',
      resetUrl,
      expiresIn: '1 jam'
    });

    const emailResult = await sendEmail({
      to: email,
      subject: 'Reset Password ZakatApp',
      html: emailTemplate.html,
      text: emailTemplate.text
    });

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error);
      // Still return success to not reveal if email exists
    }

    console.log('\n🔐 Password Reset Link:', resetUrl, '\n');

    return json({
      success: true,
      message: 'Jika akun ada, instruksi reset password telah dikirim ke email Anda'
    });

  } catch (err: any) {
    console.error('Forgot password error:', err);
    
    if (err.status) throw err;
    
    throw error(500, { message: 'Failed to process request' });
  }
};
