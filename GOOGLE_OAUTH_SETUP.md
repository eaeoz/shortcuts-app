# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your Shortcuts application.

## 📋 Prerequisites

- A Google account
- Access to Google Cloud Console
- Your application running locally or deployed

## 🚀 Step-by-Step Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "Shortcuts App")
5. Click "Create"

### Step 2: Enable Google+ API

1. In your Google Cloud Project, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

### Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace)
3. Click "Create"
4. Fill in the required fields:
   - **App name**: Shortcuts App (or your app name)
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
5. Click "Save and Continue"
6. On the "Scopes" page, click "Save and Continue" (we'll use default scopes)
7. On the "Test users" page (if in testing mode), add your email and any other test users
8. Click "Save and Continue"
9. Review and click "Back to Dashboard"

### Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application" as the application type
4. Enter a name (e.g., "Shortcuts Web Client")
5. Add **Authorized JavaScript origins**:
   - For local development: `http://localhost:5173`
   - For production: `https://yourdomain.com`
6. Add **Authorized redirect URIs**:
   - For local development: `http://localhost:5000/api/auth/google/callback`
   - For production: `https://yourdomain.com/api/auth/google/callback`
7. Click "Create"
8. **IMPORTANT**: Copy your Client ID and Client Secret

### Step 5: Update Environment Variables

1. Open your `.env` file in the project root
2. Update the following variables with your credentials:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
SESSION_SECRET=your-random-session-secret-here-change-in-production
```

**Security Notes:**
- Never commit your `.env` file to version control
- Use different credentials for development and production
- Generate a strong random string for `SESSION_SECRET`

### Step 6: Test the Integration

1. Start your backend server:
   ```bash
   npm run dev
   ```

2. Start your frontend (in a separate terminal):
   ```bash
   cd client
   npm run dev
   ```

3. Navigate to `http://localhost:5173/login` or `http://localhost:5173/register`

4. Click the "Sign in with Google" or "Sign up with Google" button

5. You should be redirected to Google's login page

6. After successful authentication, you'll be redirected back to your dashboard

## 🔧 Production Deployment

When deploying to production:

1. **Update OAuth Credentials**:
   - Go back to Google Cloud Console > Credentials
   - Edit your OAuth 2.0 Client ID
   - Add your production URLs to Authorized origins and redirect URIs

2. **Update Environment Variables**:
   ```env
   GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
   CLIENT_URL=https://yourdomain.com
   NODE_ENV=production
   ```

3. **Update Frontend URLs**:
   - In `client/src/pages/Login.tsx` and `client/src/pages/Register.tsx`
   - Change the Google OAuth button href from:
     ```jsx
     href="http://localhost:5000/api/auth/google"
     ```
   - To use environment variable or your production API URL:
     ```jsx
     href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`}
     ```

## 🎯 Features

✅ **Seamless Authentication**: Users can sign in with their Google account
✅ **Account Linking**: Existing local accounts can be linked with Google
✅ **Auto-Verification**: Google-authenticated users are automatically verified
✅ **Avatar Support**: User's Google profile picture is automatically imported
✅ **Security**: Uses secure session management and JWT tokens

## 🔐 Security Best Practices

1. **Never expose credentials**: Keep `GOOGLE_CLIENT_SECRET` secure
2. **Use HTTPS in production**: Always use secure connections
3. **Rotate secrets regularly**: Change `SESSION_SECRET` periodically
4. **Limit redirect URIs**: Only add trusted domains
5. **Monitor API usage**: Check Google Cloud Console for unusual activity

## 📝 User Data Collected

The application requests and stores:
- Email address
- Display name (used as username)
- Profile picture URL
- Google User ID (for account linking)

## 🐛 Troubleshooting

### "Redirect URI mismatch" error
- Ensure the callback URL in Google Console exactly matches `GOOGLE_CALLBACK_URL`
- Check for trailing slashes or http vs https mismatches

### "Access blocked: This app's request is invalid"
- Make sure you've enabled the Google+ API
- Verify your OAuth consent screen is properly configured
- Check that you've added test users if the app is in testing mode

### User not redirected after login
- Verify `CLIENT_URL` is correctly set in `.env`
- Check browser console for errors
- Ensure cookies are enabled

### "Invalid token" or session errors
- Make sure `SESSION_SECRET` is set
- Verify `express-session` is properly configured
- Check that cookies are being set correctly

## 📚 Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Google Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)
- [Express Session Documentation](https://www.npmjs.com/package/express-session)

## 🎉 Success!

Once configured, users can:
- Sign up with Google (creates new account automatically)
- Sign in with Google (uses existing account or creates new one)
- Link Google account to existing local account (same email)
- Enjoy seamless authentication without passwords

---

**Need Help?** If you encounter any issues, check the server logs for detailed error messages or refer to the troubleshooting section above.
