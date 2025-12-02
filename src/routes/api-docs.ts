import express from 'express';
import rateLimit from 'express-rate-limit';
import os from 'os';
import User from '../models/User';
import Shortcut from '../models/Shortcut';
import Settings from '../models/Settings';

const router = express.Router();

// Rate limiter for public API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter rate limiter for health check endpoint (more resource intensive)
const healthLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // Limit each IP to 30 requests per 5 minutes
  message: {
    error: 'Too many health check requests, please try again after 5 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Health check endpoint (rate limited)
router.get('/health', healthLimiter, async (req, res) => {
  try {
    // Check database connection by attempting to count documents
    const userCount = await User.countDocuments();
    const shortcutCount = await Shortcut.countDocuments();
    
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: 'connected',
        users: userCount,
        shortcuts: shortcutCount
      },
      system: {
        platform: os.platform(),
        nodeVersion: process.version,
        memory: {
          total: Math.round(os.totalmem() / 1024 / 1024),
          free: Math.round(os.freemem() / 1024 / 1024),
          used: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024)
        },
        cpus: os.cpus().length
      }
    };

    res.json(healthData);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    });
  }
});

// API Status endpoint (rate limited)
router.get('/status', apiLimiter, async (req, res) => {
  try {
    const settings = await Settings.findOne();
    
    res.json({
      online: true,
      version: '1.0.0',
      api: 'URL Shortener API',
      timestamp: new Date().toISOString(),
      settings: settings ? {
        title: settings.siteTitle,
        maxShortcuts: process.env.MAX_SHORTCUT || 10
      } : null
    });
  } catch (error) {
    res.status(500).json({
      online: false,
      error: 'Failed to fetch status'
    });
  }
});

export default router;
