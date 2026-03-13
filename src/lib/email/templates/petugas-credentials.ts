export interface PetugasCredentialsEmailData {
  name: string;
  organizationName: string;
  email: string;
  password: string;
  loginUrl: string;
  role: string;
}

export function generatePetugasCredentialsEmail(data: PetugasCredentialsEmailData): { html: string; text: string } {
  const { name, organizationName, email, password, loginUrl, role } = data;
  
  const roleLabel: Record<string, string> = {
    'admin': 'Admin',
    'petugas': 'Petugas',
    'viewer': 'Viewer'
  };
  
  const roleDisplay = roleLabel[role] || role;
  
  // Plain text version - primary content
  const text = `ZakatApp - Informasi Akun Anda

Assalamu'alaikum ${name},

Anda telah ditambahkan sebagai ${roleDisplay} di ${organizationName}.

INFORMASI LOGIN:
================
Email: ${email}
Password: ${password}
Peran: ${roleDisplay}

Login di: ${loginUrl}

⚠️ PENTING: Demi keamanan, segera ganti password setelah login pertama kali.

Jika Anda merasa email ini dikirim oleh kesalahan, silakan abaikan atau hubungi admin ${organizationName}.

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
  <title>Akun ZakatApp Anda - ${organizationName}</title>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <h2 style="color: #059669; margin-bottom: 20px;">Selamat Datang di ZakatApp</h2>
  
  <p>Assalamu'alaikum <strong>${name}</strong>,</p>
  
  <p>Anda telah ditambahkan sebagai <strong>${roleDisplay}</strong> di organisasi <strong>${organizationName}</strong>.</p>
  
  <h3 style="color: #065f46; margin-top: 25px;">Informasi Login</h3>
  
  <table style="background-color: #f0fdf4; border: 1px solid #a7f3d0; border-radius: 8px; padding: 16px; width: 100%; margin: 15px 0;">
    <tr>
      <td style="padding: 8px 0; color: #6b7280; width: 80px;">Email</td>
      <td style="padding: 8px 0; font-family: monospace; font-weight: 600;">${email}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; color: #6b7280;">Password</td>
      <td style="padding: 8px 0; font-family: monospace; font-weight: 600; background-color: #065f46; color: white; padding: 4px 8px; border-radius: 4px; display: inline-block;">${password}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; color: #6b7280;">Peran</td>
      <td style="padding: 8px 0;">${roleDisplay}</td>
    </tr>
  </table>
  
  <p style="margin: 25px 0;">
    <a href="${loginUrl}" style="display: inline-block; background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 500;">Login ke ZakatApp</a>
  </p>
  
  <div style="background-color: #fffbeb; border-left: 3px solid #f59e0b; padding: 12px 16px; margin: 25px 0;">
    <p style="margin: 0; color: #92400e; font-size: 14px;">
      <strong>⚠️ Penting:</strong> Demi keamanan, segera ganti password setelah login pertama kali.
    </p>
  </div>
  
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
  
  <p style="font-size: 13px; color: #6b7280;">
    Jika Anda merasa email ini dikirim oleh kesalahan, silakan abaikan atau hubungi admin ${organizationName}.
  </p>
  
  <p style="font-size: 13px; color: #6b7280; margin-top: 20px;">
    --<br>
    <strong>ZakatApp</strong><br>
    Sistem Manajemen Zakat Digital<br>
    <a href="https://zakat.app" style="color: #059669;">https://zakat.app</a>
  </p>
  
</body>
</html>`;
  
  return { html, text };
}
