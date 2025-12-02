import express, { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import passport from 'passport';
import User from '../models/User';
import { auth, AuthRequest } from '../middleware/auth';
import { verifyRecaptchaLenient } from '../middleware/recaptcha';

const router = express.Router();

// Store verification codes temporarily
interface VerificationCode {
  code: string;
  username: string;
  email: string;
  password: string;
  expiresAt: Date;
  attempts: number;
}

const verificationCodes = new Map<string, VerificationCode>();

// Generate 6-digit code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests (only count failed attempts)
  skipSuccessfulRequests: true,
});
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const USER_TIMEOUT = parseInt(process.env.USER_TIMEOUT || '1440') * 60 * 1000; // Convert minutes to milliseconds

// Detect if we're in production (cross-site deployment)
const isProduction = !!(process.env.CLIENT_URL && !process.env.CLIENT_URL.includes('localhost'));

console.log('🔧 Cookie Configuration:');
console.log('  CLIENT_URL:', process.env.CLIENT_URL);
console.log('  isProduction:', isProduction);

// Cookie settings for cross-site auth
const getCookieSettings = () => {
  const settings = {
    httpOnly: true,
    maxAge: USER_TIMEOUT,
    sameSite: isProduction ? ('none' as const) : ('lax' as const),
    secure: isProduction ? true : false,
    path: '/',
  };
  console.log('  Cookie Settings:', settings);
  return settings;
};

// Send verification code for registration
router.post(
  '/send-verification',
  verifyRecaptchaLenient,
  authLimiter,
  [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req: express.Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email or username already exists' });
      }

      // Generate 6-digit verification code
      const code = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Hash password for temporary storage
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Store verification data
      verificationCodes.set(email, {
        code,
        username,
        email,
        password: hashedPassword,
        expiresAt,
        attempts: 0
      });

      // Clean up expired codes
      for (const [key, value] of verificationCodes.entries()) {
        if (value.expiresAt < new Date()) {
          verificationCodes.delete(key);
        }
      }

      console.log(`Email verification code for ${email}: ${code}`);

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
          subject: 'Email Verification Code',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
                .content { background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .code-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 36px; font-weight: bold; letter-spacing: 8px; padding: 20px; text-align: center; border-radius: 10px; margin: 30px 0; }
                .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }
                .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>✉️ Email Verification</h1>
                  <p>Welcome to Shortcuts!</p>
                </div>
                <div class="content">
                  <p>Hello <strong>${username}</strong>,</p>
                  <p>Thank you for signing up! Please use the code below to verify your email address:</p>
                  
                  <div class="code-box">${code}</div>
                  
                  <div class="warning">
                    <strong>⚠️ Important:</strong>
                    <ul style="margin: 10px 0;">
                      <li>This code is valid for 15 minutes</li>
                      <li>You have 4 attempts to enter the correct code</li>
                      <li>Never share this code with anyone</li>
                    </ul>
                  </div>
                  
                  <p>If you didn't create an account, please ignore this email.</p>
                  
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
Welcome to Shortcuts!

Hello ${username},

Thank you for signing up! Your email verification code is:

${code}

This code is valid for 15 minutes.
You have 4 attempts to enter the correct code.

If you didn't create an account, please ignore this email.

---
Shortcuts App - Automated Message
          `,
        });

        console.log('✅ Verification email sent successfully');
      } catch (emailError) {
        console.error('❌ Failed to send email:', emailError);
        // Continue anyway - code is still valid
      }

      res.json({ 
        message: 'Verification code sent to your email',
        success: true
      });
    } catch (error) {
      console.error('Send verification error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Verify email and create account
router.post(
  '/verify-email',
  async (req: express.Request, res: Response) => {
    try {
      const { email, code } = req.body;

      if (!email || !code) {
        return res.status(400).json({ message: 'Email and code are required' });
      }

      // Check if verification data exists
      const verifyData = verificationCodes.get(email);
      if (!verifyData) {
        return res.status(400).json({ 
          message: 'Invalid or expired verification code. Please request a new one.' 
        });
      }

      // Check if expired
      if (verifyData.expiresAt < new Date()) {
        verificationCodes.delete(email);
        return res.status(400).json({ 
          message: 'Verification code has expired. Please request a new one.' 
        });
      }

      // Check attempts
      if (verifyData.attempts >= 4) {
        verificationCodes.delete(email);
        return res.status(400).json({ 
          message: 'Too many failed attempts. Please request a new verification code.' 
        });
      }

      // Verify code
      if (verifyData.code !== code) {
        verifyData.attempts += 1;
        verificationCodes.set(email, verifyData);
        
        const remainingAttempts = 4 - verifyData.attempts;
        return res.status(400).json({ 
          message: `Invalid code. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`,
          attemptsRemaining: remainingAttempts
        });
      }

      // Code is valid - create user
      const user = new User({
        username: verifyData.username,
        email: verifyData.email,
        password: verifyData.password, // Already hashed
        role: 'user',
        isVerified: true
      });

      await user.save();

      // Clear verification code
      verificationCodes.delete(email);

      // Create token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: `${USER_TIMEOUT}ms` });

      res.cookie('token', token, getCookieSettings());

      console.log(`✅ User registered successfully: ${email}`);

      res.status(201).json({
        message: 'Email verified and account created successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        success: true
      });
    } catch (error) {
      console.error('Verify email error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Register (with rate limiting) - Keep for backward compatibility
router.post(
  '/register',
  authLimiter,
  [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req: express.Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password } = req.body;

      // Check if user exists
      let user = await User.findOne({ $or: [{ email }, { username }] });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user (backward compatibility - auto-verify)
      user = new User({
        username,
        email,
        password: hashedPassword,
        role: 'user',
        isVerified: true
      });

      await user.save();

      // Create token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: `${USER_TIMEOUT}ms` });

      res.cookie('token', token, getCookieSettings());

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login (with rate limiting)
router.post(
  '/login',
  verifyRecaptchaLenient,
  authLimiter,
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').exists().withMessage('Password is required')
  ],
  async (req: express.Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check if user is verified
      if (!user.isVerified) {
        return res.status(403).json({ 
          message: 'Your account is unverified or suspended. Please contact administrator.',
          status: 'unverified'
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Create token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: `${USER_TIMEOUT}ms` });

      res.cookie('token', token, getCookieSettings());

      res.json({
        message: 'Login successful',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Logout
router.post('/logout', (req: express.Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
});

// Get current user
router.get('/me', auth as any, async (req: any, res: Response) => {
  try {
    const user = req.user as any;
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Exchange token for cookie (for OAuth callback)
router.post('/set-cookie', async (req: express.Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Get user to return user data
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set cookie with the provided token
    res.cookie('token', token, getCookieSettings());

    console.log('✅ Cookie set for user:', user.email);

    res.json({
      message: 'Cookie set successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Set cookie error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Debug endpoint to check cookie configuration
router.get('/debug/config', (req: express.Request, res: Response) => {
  res.json({
    CLIENT_URL: process.env.CLIENT_URL,
    isProduction,
    cookieSettings: getCookieSettings(),
    headers: {
      origin: req.get('origin'),
      referer: req.get('referer'),
    }
  });
});

// Google OAuth Routes
router.get(
  '/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'  // Force account selection
  })
);

router.get(
  '/google/callback',
  (req: any, res: Response, next: any) => {
    passport.authenticate('google', { session: false }, (err: any, user: any, info: any) => {
      if (err) {
        console.error('Google auth error:', err);
        return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
      }
      
      if (!user) {
        // Check if there's a message about unverified account
        if (info && info.message && info.message.includes('unverified')) {
          return res.redirect(`${process.env.CLIENT_URL}/login?error=unverified`);
        }
        return res.redirect(`${process.env.CLIENT_URL}/login?error=no_user`);
      }

      // Create JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: `${USER_TIMEOUT}ms` });

      console.log('🍪 Google OAuth - Creating token for user:', user.email);
      console.log('🔄 Redirecting with token to frontend');

      // Pass token to frontend via URL parameter
      // Frontend will set the cookie via a subsequent API call
      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    })(req, res, next);
  }
);

export default router;
