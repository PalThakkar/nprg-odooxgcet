import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendWelcomeEmail({
  to,
  name,
  loginId,
  password,
  companyName
}: {
  to: string,
  name: string,
  loginId: string,
  password: string,
  companyName: string
}) {
  // Check if credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('--- EMAIL NOT SENT: EMAIL_USER/PASS not set in .env ---');
    console.log('Would have sent email to:', to);
    console.log('Login ID:', loginId);
    console.log('Password:', password);
    console.log('Company:', companyName);
    return { success: false, message: 'SMTP not configured' };
  }

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #4f46e5; padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to ${companyName}</h1>
      </div>
      <div style="padding: 32px; background-color: white;">
        <h2 style="color: #1a202c; margin-top: 0;">Hello, ${name}!</h2>
        <p style="color: #4a5568; line-height: 1.6;">Your administrator has created an account for you at <b>${companyName}</b>. You can now log in using the credentials below:</p>
        
        <div style="background-color: #f7fafc; border: 1px solid #edf2f7; border-radius: 8px; padding: 24px; margin: 24px 0;">
          <table style="width: 100%;">
            <tr>
              <td style="color: #718096; font-size: 12px; font-weight: bold; text-transform: uppercase; padding-bottom: 4px;">Login ID</td>
            </tr>
            <tr>
              <td style="color: #4f46e5; font-size: 20px; font-weight: 800; font-family: monospace;">${loginId}</td>
            </tr>
            <tr style="height: 16px;"><td></td></tr>
            <tr>
              <td style="color: #718096; font-size: 12px; font-weight: bold; text-transform: uppercase; padding-bottom: 4px;">Temporary Password</td>
            </tr>
            <tr>
              <td style="color: #1a202c; font-size: 18px; font-weight: 600;">${password}</td>
            </tr>
          </table>
        </div>

        <p style="color: #4a5568; line-height: 1.6;">Please change your password after your first login for security purposes.</p>
        
        <div style="margin-top: 32px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/login" 
             style="background-color: #4f46e5; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            Log In to Your Dashboard
          </a>
        </div>
      </div>
      <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #a0aec0; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"${companyName} HR" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Welcome to ${companyName}! Your Login Credentials`,
      html: htmlContent,
      text: `Hello ${name}, your account is ready at ${companyName}. Login ID: ${loginId}, Password: ${password}. Log in at ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/login`,
    });

    console.log('Email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}
