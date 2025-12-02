import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User, { IUser } from '../models/User';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // User exists, update last login
          user.lastLogin = new Date();
          await user.save();
          return done(null, user);
        }

        // Check if user exists with this email (from local auth)
        user = await User.findOne({ email: profile.emails?.[0]?.value });

        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id;
          user.authProvider = 'google';
          user.avatar = profile.photos?.[0]?.value;
          user.isVerified = true; // Google accounts are verified
          user.lastLogin = new Date();
          await user.save();
          return done(null, user);
        }

        // Create new user
        const newUser = new User({
          username: profile.displayName || profile.emails?.[0]?.value.split('@')[0] || 'user' + Date.now(),
          email: profile.emails?.[0]?.value,
          googleId: profile.id,
          authProvider: 'google',
          avatar: profile.photos?.[0]?.value,
          role: 'user',
          isVerified: true, // Google accounts are pre-verified
          password: Math.random().toString(36), // Random password (won't be used)
        });

        await newUser.save();
        done(null, newUser);
      } catch (error) {
        console.error('Google OAuth Error:', error);
        done(error as Error, undefined);
      }
    }
  )
);

export default passport;
