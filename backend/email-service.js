// Email Service for Daily Reports
// Send beautiful HTML reports via email

import nodemailer from 'nodemailer';
import 'dotenv/config';

/**
 * Create email transporter
 * Supports Gmail, SendGrid, or any SMTP
 */
function createTransporter() {
  // Check if Gmail is configured
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  
  // Check if custom SMTP is configured
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }
  
  // No email configured - return null
  return null;
}

/**
 * Send daily report email
 * @param {Object} options - Email options
 * @returns {Promise<Object>} Send result
 */
export async function sendDailyReportEmail(options = {}) {
  const {
    to,
    subject = '🚫 Your Daily Habit Report',
    htmlContent,
    textContent
  } = options;
  
  const transporter = createTransporter();
  
  if (!transporter) {
    console.warn('⚠️  Email not configured. Set EMAIL_USER and EMAIL_PASSWORD in .env');
    return {
      success: false,
      error: 'Email not configured',
      message: 'To enable emails, add EMAIL_USER and EMAIL_PASSWORD to backend/.env'
    };
  }
  
  try {
    const info = await transporter.sendMail({
      from: `"Habit Breaker" <${process.env.EMAIL_USER || 'noreply@habitbreaker.ai'}>`,
      to: to,
      subject: subject,
      text: textContent,
      html: htmlContent
    });
    
    console.log('✅ Email sent successfully:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to send email'
    };
  }
}

/**
 * Check if email is configured
 */
export function isEmailConfigured() {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) || 
         !!(process.env.SMTP_HOST && process.env.SMTP_USER);
}

/**
 * Test email configuration
 */
export async function testEmailConfig() {
  const transporter = createTransporter();
  
  if (!transporter) {
    return {
      configured: false,
      message: 'Email not configured'
    };
  }
  
  try {
    await transporter.verify();
    return {
      configured: true,
      message: 'Email configuration verified'
    };
  } catch (error) {
    return {
      configured: false,
      error: error.message,
      message: 'Email configuration invalid'
    };
  }
}

export default {
  sendDailyReportEmail,
  isEmailConfigured,
  testEmailConfig
};

