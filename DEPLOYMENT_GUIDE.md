# 🚀 Deployment Guide - Netlify + Koyeb

This guide will help you deploy your URL Shortener application with the frontend on **Netlify** and the backend on **Koyeb**.

---

## 📋 Prerequisites

- [Netlify Account](https://netlify.com)
- [Koyeb Account](https://koyeb.com)
- GitHub repository with your code
- MongoDB Atlas database (already configured)
- All credentials rotated (see SECURITY_ROTATION_GUIDE.md)

---

## 🎯 Part 1: Deploy Backend to Koyeb

### Step 1: Prepare Backend for Production

Your backend is already configured for production. The `src/server.ts` uses environment variables for configuration.

### Step 2: Deploy to Koyeb

1. **Login to Koyeb**: https://app.koyeb.com/

2. **Create New App**:
   - Click "Create App"
   - Choose "GitHub" as deployment method
   - Select your repository: `shortcuts-app`
   - Branch: `main` (or your default branch)

3. **Configure Build Settings**:
   - **Builder**: Buildpack (Node.js)
   - **Work directory**: `/` (root directory - leave empty or set to `/`)
   - **Build command**: `npm run build`
   - **Run command**: `npm start`
   - **Port**: `5000`
   - **Instance type**: Select appropriate size (Free tier or Nano for testing)
   
   **Note**: The build script automatically:
   - Installs root dependencies (Koyeb does this)
   - Compiles TypeScript (`tsc`)
   - Installs client dependencies (`cd client && npm install`)
   - Builds React app (`npm run build`)

4. **Set Environment Variables**:
   
   Click "Add Environment Variable" and add each of these:

   ```env
   NODE_ENV=production
   PORT=5000
   
   # MongoDB
   MONGODB_URI=mongodb+srv://sedat:YOUR_PASSWORD@cluster0.aqhcv7a.mongodb.net/shortcuts
   MONGODB_DB_NAME=shortcuts
   
   # Application
   MAX_SHORTCUT=10
   USER_TIMEOUT=1440
   JWT_SECRET=your-jwt-secret-here
   CLIENT_URL=https://your-app-name.netlify.app
   
   # Email (Yandex SMTP)
   SMTP_HOST=smtp.yandex.com
   SMTP_PORT=587
   SMTP_USER=sedatergoz@yandex.com
   SMTP_PASS=your-rotated-smtp-password
   RECIPIENT_EMAIL=sedatergoz@gmail.com
   
   # reCAPTCHA
   RECAPTCHA_SECRET_KEY=your-rotated-recaptcha-secret-key
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-rotated-google-client-secret
   GOOGLE_CALLBACK_URL=https://your-koyeb-app.koyeb.app/api/auth/google/callback
   
   # Session
   SESSION_SECRET=your-session-secret-here
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Note your Koyeb URL: `https://your-app-name.koyeb.app`

### Step 3: Update Google OAuth Callback

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 Client ID
3. Add to **Authorized redirect URIs**:
   ```
   https://your-koyeb-app.koyeb.app/api/auth/google/callback
   ```
4. Save changes

---

## 🎨 Part 2: Deploy Frontend to Netlify

### Step 1: Create Client Environment File

1. **In your local project**, create `client/.env` file:

   ```env
   VITE_RECAPTCHA_SITE_KEY=your-rotated-recaptcha-site-key
   VITE_API_URL=https://your-koyeb-app.koyeb.app
   ```

2. **Test locally** to ensure it works:
   ```bash
   cd client
   npm run dev
   ```

### Step 2: Deploy to Netlify

#### Option A: Deploy via Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   cd client
   netlify init
   ```
   
   - Choose "Create & configure a new site"
   - Select your team
   - Enter site name (or leave blank for random)
   
4. **Configure build settings** when prompted:
   - Build command: `npm run build`
   - Publish directory: `dist`

5. **Set environment variables**:
   ```bash
   netlify env:set VITE_RECAPTCHA_SITE_KEY "your-recaptcha-site-key"
   netlify env:set VITE_API_URL "https://your-koyeb-app.koyeb.app"
   ```

6. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

#### Option B: Deploy via Netlify Dashboard

1. **Login to Netlify**: https://app.netlify.com/

2. **Import from Git**:
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select your repository: `shortcuts-app`
   - Branch: `main`

3. **Configure Build Settings**:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`
   - **Node version**: 20 (set in netlify.toml)

4. **Set Environment Variables**:
   - Go to Site settings → Environment variables
   - Add:
     ```
     VITE_RECAPTCHA_SITE_KEY = your-recaptcha-site-key
     VITE_API_URL = https://your-koyeb-app.koyeb.app
     ```

5. **Deploy**:
   - Click "Deploy site"
   - Wait for deployment
   - Note your Netlify URL: `https://your-app-name.netlify.app`

### Step 3: Configure Custom Domain (Optional)

1. Go to **Domain settings** in Netlify
2. Add your custom domain
3. Update DNS records as instructed

---

## 🔄 Part 3: Final Configuration Updates

### 1. Update Backend CLIENT_URL

Go back to Koyeb and update the `CLIENT_URL` environment variable:

```env
CLIENT_URL=https://your-app-name.netlify.app
```

Redeploy the backend for changes to take effect.

### 2. Update Google OAuth Authorized Origins

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 Client ID
3. Add to **Authorized JavaScript origins**:
   ```
   https://your-app-name.netlify.app
   ```
4. Add to **Authorized redirect URIs**:
   ```
   https://your-koyeb-app.koyeb.app/api/auth/google/callback
   ```
5. Save changes

### 3. Update reCAPTCHA Domains

1. Go to [reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Edit your site
3. Add domains:
   ```
   your-app-name.netlify.app
   your-koyeb-app.koyeb.app
   ```
4. Save changes

---

## ✅ Part 4: Verification

### Test the Deployment

1. **Visit your Netlify URL**: `https://your-app-name.netlify.app`

2. **Test Registration**:
   - Register a new user
   - Check email for verification

3. **Test Login**:
   - Login with the registered user
   - Try Google OAuth login

4. **Test URL Shortening**:
   - Create a shortened URL
   - Test the redirect: `https://your-app-name.netlify.app/s/your-shortcode`

5. **Test Admin Panel**:
   - Login as admin
   - Check dashboard statistics
   - Test user management

### Monitor Logs

- **Koyeb**: Check logs in Koyeb dashboard
- **Netlify**: Check function logs and build logs in Netlify dashboard

---

## 🐛 Troubleshooting

### Issue: CORS Errors

**Solution**: Ensure `CLIENT_URL` in Koyeb matches your Netlify URL exactly (including https://).

### Issue: npm start Not Starting App

**Solution**:
1. Ensure build command is: `npm run build`
2. This compiles TypeScript to `dist/` folder
3. The start command `npm start` runs `node dist/server.js`
4. Check Koyeb logs for build errors
5. Verify TypeScript compiled successfully

### Issue: "Cannot find module dist/server.js"

**Solution**:
1. Build command must be `npm run build` (not just `npm install`)
2. Koyeb automatically runs `npm install` first
3. Then runs your build command which creates the `dist/` folder
4. Work directory should be `/` (root)

### Issue: Build fails with exit code 51

**Solution**:
1. Koyeb runs `npm install` automatically first
2. Then runs your build command: `npm run build`
3. The build script:
   - Compiles backend: `tsc` → creates `dist/`
   - Installs client deps: `cd client && npm install`
   - Builds frontend: `npm run build`
4. If it fails, check that:
   - `engines` field specifies Node.js version
   - All dependencies are in package.json
   - TypeScript compiles without errors locally

### Issue: Client dependencies not found during build

**Solution**:
The build script now includes `cd client && npm install && npm run build` to ensure client dependencies are installed during the build process.

### Issue: API Not Connecting

**Solution**: 
1. Check `VITE_API_URL` in Netlify environment variables
2. Ensure it points to your Koyeb backend URL
3. Redeploy Netlify after changing environment variables

### Issue: Google OAuth Not Working

**Solution**:
1. Verify `GOOGLE_CALLBACK_URL` in Koyeb matches the redirect URI in Google Console
2. Check authorized origins include both Netlify and Koyeb URLs
3. Ensure credentials are properly rotated

### Issue: reCAPTCHA Failing

**Solution**:
1. Verify domains are added to reCAPTCHA console
2. Check `VITE_RECAPTCHA_SITE_KEY` matches the rotated key
3. Ensure `RECAPTCHA_SECRET_KEY` in Koyeb matches

### Issue: Email Not Sending

**Solution**:
1. Verify SMTP credentials are correct and rotated
2. Check Koyeb logs for SMTP errors
3. Ensure Yandex allows app password access

### Issue: Netlify build fails with "Vite requires Node.js version 20.19+"

**Solution**:
The `client/netlify.toml` file specifies Node.js version 20:
```toml
[build.environment]
  NODE_VERSION = "20"
```
If you see this error, ensure the netlify.toml file has been pushed to your repository.

---

## 📊 Monitoring & Maintenance

### Koyeb Monitoring

- Check logs regularly for errors
- Monitor resource usage
- Set up alerts for downtime

### Netlify Monitoring

- Check build logs for errors
- Monitor bandwidth usage
- Review function logs

### Database Monitoring

- Monitor MongoDB Atlas for connection issues
- Check database size and performance
- Set up alerts for high usage

---

## 🔐 Security Checklist

- [ ] All credentials rotated from GitHub exposure
- [ ] Environment variables set correctly in Koyeb
- [ ] Environment variables set correctly in Netlify
- [ ] Google OAuth configured with production URLs
- [ ] reCAPTCHA configured with production domains
- [ ] HTTPS enforced on both frontend and backend
- [ ] CORS properly configured
- [ ] Session secrets are strong and unique
- [ ] JWT secret is strong and unique
- [ ] MongoDB connection uses strong password

---

## 🚀 Quick Reference

### Environment Variables Summary

**Koyeb (Backend):**
- `MONGODB_URI`, `MONGODB_DB_NAME`
- `MAX_SHORTCUT`, `USER_TIMEOUT`
- `JWT_SECRET`, `SESSION_SECRET`
- `CLIENT_URL` (Netlify URL)
- `SMTP_*` variables
- `RECAPTCHA_SECRET_KEY`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`

**Netlify (Frontend):**
- `VITE_RECAPTCHA_SITE_KEY`
- `VITE_API_URL` (Koyeb URL)

### Important URLs

- **Frontend**: `https://your-app-name.netlify.app`
- **Backend**: `https://your-koyeb-app.koyeb.app`
- **Admin**: `https://your-app-name.netlify.app/admin`

---

## 📞 Support

If you encounter issues:

1. Check logs in Koyeb and Netlify dashboards
2. Verify all environment variables are set correctly
3. Ensure all credentials have been rotated
4. Test API endpoints directly using curl or Postman
5. Check CORS configuration matches your domains

---

**Deployment completed! Your URL shortener is now live! 🎉**
