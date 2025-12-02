import express, { Response } from 'express';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const router = express.Router();

// Store reset codes temporarily (in production, use Redis or database)
interface ResetCode {
  code: string;
  email: string;
  expiresAt: Date;
  attempts: number;
}

const resetCodes = new Map<string, ResetCode>();

// Rate limiter: 3 requests per 15 minutes for password reset
const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    message: 'Too many password reset attempts, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Generate 4-digit code
function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Request password reset - send code via email
router.post('/request-reset', resetLimiter, async (req: express.Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists for security
      return res.json({ 
        message: 'If an account exists with this email, you will receive a password reset code.'
      });
    }

    // Generate 4-digit code
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store code
    resetCodes.set(email, {
      code,
      email,
      expiresAt,
      attempts: 0
    });

    // Clean up expired codes (simple cleanup)
    for (const [key, value] of resetCodes.entries()) {
      if (value.expiresAt < new Date()) {
        resetCodes.delete(key);
      }
    }

    console.log(`Password reset code for ${email}: ${code}`); // For development

    // Send email
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Shortcuts App" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Password Reset Code',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
              .content { background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              .code-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; text-align: center; border-radius: 10px; margin: 30px 0; }
              .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Password Reset Request</h1>
                <p>You requested to reset your password</p>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p>We received a request to reset your password. Use the code below to proceed:</p>
                
                <div class="code-box">${code}</div>
                
                <div class="warning">
                  <strong>⚠️ Important:</strong>
                  <ul style="margin: 10px 0;">
                    <li>This code is valid for 15 minutes</li>
                    <li>You have 4 attempts to enter the correct code</li>
                    <li>Never share this code with anyone</li>
                  </ul>
                </div>
                
                <p>If you didn't request a password reset, please ignore this email or contact support if you're concerned about your account security.</p>
                
                <div class="footer">
                  <p>This is an automated message from Shortcuts App</p>
                  <p>Do not reply to this email</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
Password Reset Request

You requested to reset your password for Shortcuts App.

Your reset code: ${code}

This code is valid for 15 minutes.
You have 4 attempts to enter the correct code.

If you didn't request this, please ignore this email.

---
Shortcuts App - Automated Message
        `,
      });

      console.log('✅ Password reset email sent successfully');
    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError);
      // Continue anyway - code is still valid
    }

    res.json({ 
      message: 'If an account exists with this email, you will receive a password reset code.',
      success: true
    });
  } catch (error) {
    console.error('Request reset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify code and reset password
router.post('/verify-reset', async (req: express.Request, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Email, code, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if reset code exists
    const resetData = resetCodes.get(email);
    if (!resetData) {
      return res.status(400).json({ 
        message: 'Invalid or expired reset code. Please request a new one.' 
      });
    }

    // Check if expired
    if (resetData.expiresAt < new Date()) {
      resetCodes.delete(email);
      return res.status(400).json({ 
        message: 'Reset code has expired. Please request a new one.' 
      });
    }

    // Check attempts
    if (resetData.attempts >= 4) {
      resetCodes.delete(email);
      return res.status(400).json({ 
        message: 'Too many failed attempts. Please request a new reset code.' 
      });
    }

    // Verify code
    if (resetData.code !== code) {
      resetData.attempts += 1;
      resetCodes.set(email, resetData);
      
      const remainingAttempts = 4 - resetData.attempts;
      return res.status(400).json({ 
        message: `Invalid code. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`,
        attemptsRemaining: remainingAttempts
      });
    }

    // Code is valid - reset password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Clear reset code
    resetCodes.delete(email);

    console.log(`✅ Password reset successful for ${email}`);

    res.json({ 
      message: 'Password reset successful. You can now login with your new password.',
      success: true
    });
  } catch (error) {
    console.error('Verify reset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
