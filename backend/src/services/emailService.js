import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT || 587) === 465,
  auth: {
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
  },
});

export const sendAdminSetupEmail = async (email, setupUrl) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Complete your Artist Gallery administrator setup',
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; background: #f5f0eb; padding: 32px;">
        <div style="max-width: 560px; margin: 0 auto; background: white; padding: 32px; border-radius: 16px; box-shadow: 0 20px 45px rgba(17,24,39,0.08);">
          <h2 style="margin-bottom: 12px;">Administrator setup</h2>
          <p>Use the secure link below to create your administrator password and complete your setup.</p>
          <p><a href="${setupUrl}" style="display:inline-block; background:#111827; color:#fff; padding:12px 18px; border-radius:999px; text-decoration:none;">Create your password</a></p>
          <p style="font-size: 12px; color: #6b7280;">This link expires soon and can only be used once.</p>
        </div>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (email, resetUrl) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset your Artist Gallery password',
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; background: #f5f0eb; padding: 32px;">
        <div style="max-width: 560px; margin: 0 auto; background: white; padding: 32px; border-radius: 16px; box-shadow: 0 20px 45px rgba(17,24,39,0.08);">
          <h2 style="margin-bottom: 12px;">Reset your password</h2>
          <p>We received a request to reset your password. Use the link below to continue.</p>
          <p><a href="${resetUrl}" style="display:inline-block; background:#b45309; color:#fff; padding:12px 18px; border-radius:999px; text-decoration:none;">Reset password</a></p>
          <p style="font-size: 12px; color: #6b7280;">If you did not request this, you can ignore this email.</p>
        </div>
      </div>
    `,
  });
};
