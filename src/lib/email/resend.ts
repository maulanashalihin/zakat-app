import { env } from '$env/dynamic/private';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

interface ResendResponse {
  data?: { id: string };
  error?: { message: string };
}

/**
 * Send email using Resend API via native fetch
 * Works reliably in Cloudflare Workers environment
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  if (!env.RESEND_API_TOKEN) {
    console.warn('RESEND_API_TOKEN not configured');
    return { success: false, error: 'Email service not configured' };
  }

  const from = options.from || env.FROM_EMAIL || 'onboarding@resend.dev';
  const replyTo = options.replyTo || env.REPLY_TO_EMAIL;

  // Ensure to is always an array
  const to = Array.isArray(options.to) ? options.to : [options.to];

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        reply_to: replyTo,
      }),
    });

    const result = await response.json() as ResendResponse;

    if (!response.ok) {
      const errorMessage = result.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      console.error('Resend API error:', errorMessage);
      return { success: false, error: errorMessage };
    }

    console.log('Email sent successfully:', result.data?.id);
    return { success: true };

  } catch (err: any) {
    console.error('Send email error:', err);
    return { success: false, error: err.message || 'Unknown error sending email' };
  }
}

/**
 * Check if email service is configured
 */
export function isEmailConfigured(): boolean {
  return !!env.RESEND_API_TOKEN && !!env.FROM_EMAIL;
}

/**
 * @deprecated Use sendEmail instead. Kept for backward compatibility.
 */
export function getResendClient(): null {
  console.warn('getResendClient is deprecated, use sendEmail directly');
  return null;
}
