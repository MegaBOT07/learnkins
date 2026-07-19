import nodemailer from 'nodemailer';
let _transporter = null;
function getTransporter() {
  if (_transporter) return _transporter;
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }
  _transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: (process.env.EMAIL_PORT || 587) === '465',
    requireTLS: (process.env.EMAIL_PORT || 587) !== '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  return _transporter;
}
export const sendEmail = async options => {
  const transporter = getTransporter();
  if (!transporter) {
    console.log('Email not configured, skipping:', {
      to: options.email
    });
    return null;
  }
  const mailOptions = {
    from: `"LearnKins" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || options.message
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId, '→', options.email);
    return info;
  } catch (error) {
    console.error('Email send error:', error.message);
    throw error;
  }
};