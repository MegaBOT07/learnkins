import nodemailer from 'nodemailer';
export const sendEmail = async options => {
  try {
    // Check if email configuration is available
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email not configured, skipping:', {
        to: options.email,
        EMAIL_HOST: Boolean(process.env.EMAIL_HOST),
        EMAIL_USER: Boolean(process.env.EMAIL_USER),
        EMAIL_PASS: Boolean(process.env.EMAIL_PASS)
      });
      return;
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      // Hostinger typically expects STARTTLS on 587
      secure: (process.env.EMAIL_PORT || 587) === '465',
      requireTLS: (process.env.EMAIL_PORT || 587) !== '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      // Some providers use certificate chains that can fail strict verification
      tls: {
        rejectUnauthorized: false
      }
    });

    // Define email options
    const mailOptions = {
      from: `"LearnKins Support" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.log('Email send failed (non-blocking):', error.message);
    // Don't throw - email is optional
  }
};