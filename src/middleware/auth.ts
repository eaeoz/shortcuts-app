import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
  userId?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Try to get token from multiple sources (cookie first, then header)
    let token = req.cookies.token;
    
    // If no cookie, try Authorization header
    if (!token) {
      const authHeader = req.header('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.replace('Bearer ', '');
      }
    }

    console.log('🔍 Auth Middleware Check:');
    console.log('  Cookies:', req.cookies);
    console.log('  Authorization header:', req.header('Authorization') ? 'Present' : 'Missing');
    console.log('  Token found:', !!token);
    console.log('  Token source:', req.cookies.token ? 'Cookie' : (token ? 'Header' : 'None'));
    console.log('  Origin:', req.get('origin'));
    console.log('  Referer:', req.get('referer'));
    console.log('  User-Agent:', req.get('user-agent')?.substring(0, 100));

    if (!token) {
      res.status(401).json({ message: 'No authentication token, access denied' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      res.status(401).json({ message: 'Token is not valid' });
      return;
    }

    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const adminAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await auth(req, res, () => {});

    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ message: 'Access denied. Admin privileges required.' });
      return;
    }

    next();
  } catch (error) {
    res.status(403).json({ message: 'Access denied' });
  }
};
