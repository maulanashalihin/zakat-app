export interface VerificationEmailData {
  name: string;
  verificationUrl: string;
  expiresIn: string;
}

export function generateVerificationEmail(data: VerificationEmailData): { html: string; text: string } {
  const { name, verificationUrl, expiresIn } = data;
  
  // Plain text version - this is the primary content
  const text = `ZakatApp - Verifikasi Email

Assalamu'alaikum ${name},

Terima kasih telah mendaftar di ZakatApp.

Silakan verifikasi email Anda dengan mengklik link berikut:
${verificationUrl}

Link ini akan berakhir dalam ${expiresIn}.

Jika Anda tidak mendaftar di ZakatApp, abaikan email ini.

--
ZakatApp
Sistem Manajemen Zakat Digital
https://zakat.app
`;

  // Simple HTML version - minimal styling, text-focused
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifikasi Email - ZakatApp</title>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <h2 style="color: #059669; margin-bottom: 20px;">ZakatApp - Verifikasi Email</h2>
  
  <p>Assalamu'alaikum <strong>${name}</strong>,</p>
  
  <p>Terima kasih telah mendaftar di ZakatApp.</p>
  
  <p>Silakan verifikasi email Anda dengan mengklik link berikut:</p>
  
  <p style="margin: 25px 0;">
    <a href="${verificationUrl}" style="display: inline-block; background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 500;">Verifikasi Email Saya</a>
  </p>
  
  <p style="font-size: 14px; color: #666;">
    Atau salin link ini ke browser:<br>
    <code style="background: #f3f4f6; padding: 8px 12px; display: inline-block; margin-top: 8px; word-break: break-all;">${verificationUrl}</code>
  </p>
  
  <p style="color: #dc2626; font-size: 14px; margin-top: 20px;">
    <strong>⏰ Link berakhir dalam ${expiresIn}</strong>
  </p>
  
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
  
  <p style="font-size: 13px; color: #6b7280;">
    Jika Anda tidak mendaftar di ZakatApp, abaikan email ini.
  </p>
  
  <p style="font-size: 13px; color: #6b7280; margin-top: 20px;">
    --<br>
    <strong>ZakatApp</strong><br>
    Sistem Manajemen Zakat Digital<br>
    <a href="https://zakat.drip.id" style="color: #059669;">https://zakat.drip.id</a>
  </p>
  
</body>
</html>`;
  
  return { html, text };
}
