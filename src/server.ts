import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/database';
import passport from './config/passport';
import authRoutes from './routes/auth';
import shortcutRoutes from './routes/shortcuts';
import adminRoutes from './routes/admin';
import contactRoutes from './routes/contact';
import passwordResetRoutes from './routes/password-reset';
import userRoutes from './routes/user';
import apiDocsRoutes from './routes/api-docs';
import Settings from './models/Settings';
import Shortcut from './models/Shortcut';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();

// Trust proxy - required for Koyeb/production deployment behind reverse proxy
// This allows express-rate-limit to correctly identify users behind proxies
// Enable when behind reverse proxy (Koyeb, Heroku, AWS, etc.)
app.set('trust proxy', 1);

// Rate limiter for general public endpoints
const publicApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Security Middleware
// 1. Helmet - Sets various HTTP headers for security
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
  xssFilter: true, // Enable X-XSS-Protection header
}));

// Additional security headers
app.use((req, res, next) => {
  // X-XSS-Protection header for older browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// 2. Prevent HTTP Parameter Pollution
app.use(hpp());

// 3. Compression middleware for response compression
app.use(compression());

// CORS Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:8888' // Netlify Dev
  ],
  credentials: true
}));

// Body parsing middleware with limit
app.use(express.json({ limit: '10kb' })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Manual NoSQL injection prevention middleware
app.use((req, res, next) => {
  // Sanitize an object by removing dangerous keys
  const sanitize = (obj: any): void => {
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      Object.keys(obj).forEach(key => {
        // Remove keys starting with $ or containing .
        if (key.startsWith('$') || key.includes('.')) {
          delete obj[key];
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitize(obj[key]);
        }
      });
    }
  };

  // Only sanitize body (query and params are read-only in Express 5)
  if (req.body && typeof req.body === 'object') {
    sanitize(req.body);
  }
  
  next();
});

// Session middleware (required for Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-session-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Required for cross-site cookies
      domain: process.env.NODE_ENV === 'production' ? undefined : undefined, // Let browser handle domain
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/shortcuts', shortcutRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api/user', userRoutes);
app.use('/api', apiDocsRoutes);

// Public settings endpoint (no auth required, but rate limited)
app.get('/api/settings', publicApiLimiter, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Root route - API Documentation
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/api-docs.html'));
});

// Shortcut redirect route
app.get('/s/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const shortcut = await Shortcut.findOne({ shortCode });

    if (!shortcut) {
      return res.status(404).json({ message: 'Shortcut not found' });
    }

    // Increment click count
    shortcut.clicks += 1;
    shortcut.lastAccessed = new Date();
    await shortcut.save();

    // Redirect to original URL
    res.redirect(shortcut.originalUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
