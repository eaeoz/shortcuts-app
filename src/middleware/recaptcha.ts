import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

export interface RecaptchaRequest extends Request {
  recaptchaScore?: number;
}

export const verifyRecaptcha = async (
  req: RecaptchaRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const recaptchaToken = req.body.recaptchaToken;

    if (!recaptchaToken) {
      res.status(400).json({ message: 'reCAPTCHA token is required' });
      return;
    }

    // Verify the token with Google
    const response = await axios.post(RECAPTCHA_VERIFY_URL, null, {
      params: {
        secret: RECAPTCHA_SECRET_KEY,
        response: recaptchaToken,
      },
    });

    const { success, score, action } = response.data;

    if (!success) {
      res.status(400).json({ message: 'reCAPTCHA verification failed' });
      return;
    }

    // reCAPTCHA v3 returns a score from 0.0 to 1.0
    // 1.0 is very likely a good interaction, 0.0 is very likely a bot
    // We'll use 0.5 as the threshold
    if (score < 0.5) {
      console.log(`reCAPTCHA score too low: ${score} for action: ${action}`);
      res.status(400).json({ 
        message: 'Suspicious activity detected. Please try again later.',
        score 
      });
      return;
    }

    // Store the score in the request for logging purposes
    req.recaptchaScore = score;
    
    console.log(`✅ reCAPTCHA verified successfully. Score: ${score}, Action: ${action}`);
    next();
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    res.status(500).json({ message: 'reCAPTCHA verification failed' });
  }
};

// Optional: Less strict verification for development
export const verifyRecaptchaLenient = async (
  req: RecaptchaRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const recaptchaToken = req.body.recaptchaToken;

    if (!recaptchaToken) {
      // In development, we might want to skip if token is missing
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ reCAPTCHA token missing (development mode - skipping)');
        next();
        return;
      }
      res.status(400).json({ message: 'reCAPTCHA token is required' });
      return;
    }

    const response = await axios.post(RECAPTCHA_VERIFY_URL, null, {
      params: {
        secret: RECAPTCHA_SECRET_KEY,
        response: recaptchaToken,
      },
    });

    const { success, score, action } = response.data;

    if (!success) {
      res.status(400).json({ message: 'reCAPTCHA verification failed' });
      return;
    }

    // More lenient threshold (0.3 instead of 0.5)
    if (score < 0.3) {
      console.log(`reCAPTCHA score too low: ${score} for action: ${action}`);
      res.status(400).json({ 
        message: 'Suspicious activity detected. Please try again later.',
        score 
      });
      return;
    }

    req.recaptchaScore = score;
    console.log(`✅ reCAPTCHA verified. Score: ${score}, Action: ${action}`);
    next();
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    // In development, allow the request to proceed even if verification fails
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ reCAPTCHA verification failed (development mode - proceeding anyway)');
      next();
      return;
    }
    res.status(500).json({ message: 'reCAPTCHA verification failed' });
  }
};
