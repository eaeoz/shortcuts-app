import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import Shortcut from '../models/Shortcut';
import { auth, AuthRequest } from '../middleware/auth';

const router = express.Router();
const MAX_SHORTCUT = parseInt(process.env.MAX_SHORTCUT || '10');

// Get all shortcuts for current user
router.get('/', auth as any, async (req: any, res: Response) => {
  try {
    const shortcuts = await Shortcut.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ shortcuts });
  } catch (error) {
    console.error('Get shortcuts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if a shortcode is available (globally across all users)
router.get('/check/:shortCode', auth as any, async (req: any, res: Response) => {
  try {
    const { shortCode } = req.params;
    
    // Check if shortcode exists globally (any user)
    const exists = await Shortcut.findOne({ shortCode });
    
    res.json({ 
      available: !exists,
      shortCode: shortCode
    });
  } catch (error) {
    console.error('Check shortcode error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create shortcut
router.post(
  '/',
  auth as any,
  [
    body('originalUrl').isURL().withMessage('Please provide a valid URL'),
    body('shortCode')
      .optional()
      .trim()
      .isLength({ min: 4 })
      .withMessage('Short code must be at least 4 characters')
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Short code can only contain letters, numbers, hyphens, and underscores')
  ],
  async (req: any, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check shortcut limit
      const userShortcutCount = await Shortcut.countDocuments({ userId: req.userId });
      if (userShortcutCount >= MAX_SHORTCUT) {
        return res.status(400).json({ message: `Maximum ${MAX_SHORTCUT} shortcuts allowed` });
      }

      let { originalUrl, shortCode } = req.body;

      // Generate random short code if not provided
      if (!shortCode) {
        shortCode = generateShortCode();
        let exists = await Shortcut.findOne({ shortCode });
        while (exists) {
          shortCode = generateShortCode();
          exists = await Shortcut.findOne({ shortCode });
        }
      } else {
        // Check if custom short code already exists
        const exists = await Shortcut.findOne({ shortCode });
        if (exists) {
          return res.status(400).json({ message: 'Short code already in use' });
        }
      }

      const shortcut = new Shortcut({
        userId: req.userId,
        shortCode,
        originalUrl
      });

      await shortcut.save();

      res.status(201).json({ shortcut });
    } catch (error) {
      console.error('Create shortcut error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update shortcut
router.put(
  '/:id',
  auth as any,
  [
    body('originalUrl').optional().isURL().withMessage('Please provide a valid URL'),
    body('shortCode')
      .optional()
      .trim()
      .isLength({ min: 4 })
      .withMessage('Short code must be at least 4 characters')
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Short code can only contain letters, numbers, hyphens, and underscores')
  ],
  async (req: any, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const shortcut = await Shortcut.findOne({ _id: req.params.id, userId: req.userId });

      if (!shortcut) {
        return res.status(404).json({ message: 'Shortcut not found' });
      }

      const { originalUrl, shortCode } = req.body;

      if (shortCode && shortCode !== shortcut.shortCode) {
        const exists = await Shortcut.findOne({ shortCode });
        if (exists) {
          return res.status(400).json({ message: 'Short code already in use' });
        }
        shortcut.shortCode = shortCode;
      }

      if (originalUrl) {
        shortcut.originalUrl = originalUrl;
      }

      await shortcut.save();

      res.json({ shortcut });
    } catch (error) {
      console.error('Update shortcut error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete shortcut
router.delete('/:id', auth as any, async (req: any, res: Response) => {
  try {
    const shortcut = await Shortcut.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!shortcut) {
      return res.status(404).json({ message: 'Shortcut not found' });
    }

    res.json({ message: 'Shortcut deleted successfully' });
  } catch (error) {
    console.error('Delete shortcut error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to generate random short code
function generateShortCode(length: number = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default router;
