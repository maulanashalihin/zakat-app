export interface PasswordResetEmailData {
  name: string;
  resetUrl: string;
  expiresIn: string;
}

export function generatePasswordResetEmail(data: PasswordResetEmailData): { html: string; text: string } {
  const { name, resetUrl, expiresIn } = data;
  
  // Plain text version - primary content
  const text = `ZakatApp - Reset Password

Assalamu'alaikum ${name},

Kami menerima permintaan untuk mereset password akun ZakatApp Anda.

Silakan klik link berikut untuk membuat password baru:
${resetUrl}

Link ini akan berakhir dalam ${expiresIn}.

⚠️ Jika Anda tidak meminta reset password, abaikan email ini. Password Anda tetap aman.

--
ZakatApp
Sistem Manajemen Zakat Digital
https://zakat.app
`;

  // Simple HTML version - minimal styling
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password - ZakatApp</title>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <h2 style="color: #059669; margin-bottom: 20px;">ZakatApp - Reset Password</h2>
  
  <p>Assalamu'alaikum <strong>${name}</strong>,</p>
  
  <p>Kami menerima permintaan untuk mereset password akun ZakatApp Anda.</p>
  
  <p>Silakan klik link berikut untuk membuat password baru:</p>
  
  <p style="margin: 25px 0;">
    <a href="${resetUrl}" style="display: inline-block; background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 500;">Reset Password</a>
  </p>
  
  <p style="font-size: 14px; color: #666;">
    Atau salin link ini ke browser:<br>
    <code style="background: #f3f4f6; padding: 8px 12px; display: inline-block; margin-top: 8px; word-break: break-all;">${resetUrl}</code>
  </p>
  
  <p style="color: #dc2626; font-size: 14px; margin-top: 20px;">
    <strong>⏰ Link berakhir dalam ${expiresIn}</strong>
  </p>
  
  <div style="background-color: #fffbeb; border-left: 3px solid #f59e0b; padding: 12px 16px; margin: 25px 0;">
    <p style="margin: 0; color: #92400e; font-size: 14px;">
      <strong>⚠️ Perhatian:</strong> Jika Anda tidak meminta reset password, abaikan email ini. Password Anda tetap aman.
    </p>
  </div>
  
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
  
  <p style="font-size: 13px; color: #6b7280;">
    --<br>
    <strong>ZakatApp</strong><br>
    Sistem Manajemen Zakat Digital<br>
    <a href="https://zakat.app" style="color: #059669;">https://zakat.app</a>
  </p>
  
</body>
</html>`;
  
  return { html, text };
}
