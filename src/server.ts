import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/database';
import authRoutes from './routes/auth';
import shortcutRoutes from './routes/shortcuts';
import adminRoutes from './routes/admin';
import Settings from './models/Settings';
import Shortcut from './models/Shortcut';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/shortcuts', shortcutRoutes);
app.use('/api/admin', adminRoutes);

// Public settings endpoint (no auth required)
app.get('/api/settings', async (req, res) => {
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
