# 🚀 Deployment Guide - Netlify + Zeabur

This guide will help you deploy your URL Shortener application with the frontend on **Netlify** and the backend on **Zeabur**.

---

## 📋 Prerequisites

- [Netlify Account](https://netlify.com)
- [Zeabur Account](https://zeabur.com)
- GitHub repository with your code
- MongoDB Atlas database (already configured)
- All credentials rotated (see SECURITY_ROTATION_GUIDE.md)

---

## 🎯 Part 1: Deploy Backend to Zeabur

### Step 1: Prepare Backend for Production

Your backend is already configured for production. The `src/server.ts` uses environment variables for configuration.

### Step 2: Deploy to Zeabur

1. **Login to Zeabur**: https://zeabur.com/

2. **Create New Project**:
   - Click "New Project"
   - Choose a region closest to your users
   - Give your project a name

3. **Deploy from GitHub**:
   - Click "Deploy New Service"
   - Choose "GitHub" as the source
   - Authorize Zeabur to access your GitHub repositories
   - Select your repository: `shortcuts-app`
   - Branch: `main` (or your default branch)

4. **Configure Service Settings**:
   - **Service Name**: Give it a meaningful name (e.g., "shortcuts-backend")
   - **Root Directory**: `/` (leave as root)
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   
   **⚠️ IMPORTANT - Port Configuration**:
   Zeabur might auto-detect port 8080, but your app needs port 5000. You have two options:
   
   **Option A (Recommended): Let Zeabur set the PORT**
   - Don't set PORT environment variable
   - Zeabur will automatically set PORT to match the exposed port
   - Your app will use whatever port Zeabur assigns
   - This is the most flexible approach
   
   **Option B: Force port 5000**
   - Set `PORT=5000` in environment variables
   - After deployment, go to your service → "Networking" tab
   - The port should be automatically detected as 5000
   - If not detected, ensure your app is listening on process.env.PORT
   
   **Note**: The build script automatically:
   - Installs root dependencies
   - Compiles TypeScript (`tsc`)
   - Installs client dependencies (`cd client && npm install`)
   - Builds React app (`npm run build`)

5. **Set Environment Variables**:
   
   Go to your service settings → Variables tab and add each of these:

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
   GOOGLE_CALLBACK_URL=https://your-app.zeabur.app/api/auth/google/callback
   
   # Session
   SESSION_SECRET=your-session-secret-here
   ```

6. **Generate Domain**:
   - Go to your service → "Networking" tab
   - Click "Generate Domain" to get a free Zeabur subdomain
   - Or add your custom domain
   - Note your Zeabur URL: `https://your-app.zeabur.app`

7. **Deploy**:
   - Zeabur will automatically deploy when you push to your GitHub branch
   - Monitor the deployment logs for any issues
   - Wait for deployment to complete

### Step 3: Update Google OAuth Callback

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 Client ID
3. Add to **Authorized redirect URIs**:
   ```
   https://your-app.zeabur.app/api/auth/google/callback
   ```
4. Save changes

---

## 🎨 Part 2: Deploy Frontend to Netlify

### Step 1: Create Client Environment File

1. **In your local project**, create `client/.env` file:

   ```env
   VITE_RECAPTCHA_SITE_KEY=your-rotated-recaptcha-site-key
   VITE_API_URL=https://your-app.zeabur.app
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
   netlify env:set VITE_API_URL "https://your-app.zeabur.app"
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
     VITE_API_URL = https://your-app.zeabur.app
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

Go back to Zeabur and update the `CLIENT_URL` environment variable:

```env
CLIENT_URL=https://your-app-name.netlify.app
```

The service will automatically redeploy when you update environment variables.

### 2. Update Google OAuth Authorized Origins

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 Client ID
3. Add to **Authorized JavaScript origins**:
   ```
   https://your-app-name.netlify.app
   ```
4. Add to **Authorized redirect URIs**:
   ```
   https://your-app.zeabur.app/api/auth/google/callback
   ```
5. Save changes

### 3. Update reCAPTCHA Domains

1. Go to [reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Edit your site
3. Add domains:
   ```
   your-app-name.netlify.app
   your-app.zeabur.app
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

- **Zeabur**: Check logs in Zeabur dashboard under your service
- **Netlify**: Check function logs and build logs in Netlify dashboard

---

## 🐛 Troubleshooting

### Issue: CORS Errors

**Solution**: Ensure `CLIENT_URL` in Zeabur matches your Netlify URL exactly (including https://).

### Issue: Build Fails

**Solution**:
1. Check Zeabur build logs for specific errors
2. Ensure build command is: `npm run build`
3. Verify all dependencies are in package.json
4. Make sure TypeScript compiles without errors locally
5. Check that Node.js version is compatible (20.x recommended)

### Issue: "Cannot find module dist/server.js"

**Solution**:
1. Build command must be `npm run build` (not just `npm install`)
2. Zeabur runs `npm install` automatically first
3. Then runs your build command which creates the `dist/` folder
4. The start command `npm start` runs `node dist/server.js`

### Issue: Service Not Starting

**Solution**:
1. Check Zeabur service logs for errors
2. Verify PORT environment variable is set to 5000
3. Ensure the start command is `npm start`
4. Check that all required environment variables are set

### Issue: API Not Connecting

**Solution**: 
1. Check `VITE_API_URL` in Netlify environment variables
2. Ensure it points to your Zeabur backend URL (e.g., `https://your-app.zeabur.app`)
3. Redeploy Netlify after changing environment variables
4. Verify the Zeabur service is running

### Issue: Google OAuth Not Working

**Solution**:
1. Verify `GOOGLE_CALLBACK_URL` in Zeabur matches the redirect URI in Google Console
2. Check authorized origins include both Netlify and Zeabur URLs
3. Ensure credentials are properly rotated
4. Make sure the callback URL uses the correct Zeabur domain

### Issue: reCAPTCHA Failing

**Solution**:
1. Verify domains are added to reCAPTCHA console (both Netlify and Zeabur)
2. Check `VITE_RECAPTCHA_SITE_KEY` matches the rotated key
3. Ensure `RECAPTCHA_SECRET_KEY` in Zeabur matches

### Issue: Email Not Sending

**Solution**:
1. Verify SMTP credentials are correct and rotated
2. Check Zeabur logs for SMTP errors
3. Ensure Yandex allows app password access
4. Test SMTP connection independently

### Issue: Netlify build fails with "Vite requires Node.js version 20.19+"

**Solution**:
The `client/netlify.toml` file specifies Node.js version 20:
```toml
[build.environment]
  NODE_VERSION = "20"
```
If you see this error, ensure the netlify.toml file has been pushed to your repository.

### Issue: Environment Variables Not Loading

**Solution**:
1. In Zeabur, go to your service → Variables tab
2. Ensure all variables are properly set
3. Click "Redeploy" after adding/updating variables
4. Check logs to confirm variables are being loaded

### Issue: Zeabur Detects Wrong Port (8080 instead of 5000)

**Solution**:

Your app uses `process.env.PORT || 5000`, which is correct. Zeabur should automatically detect the correct port. Here's how to fix:

1. **Check Environment Variables**:
   - Go to your service → Variables tab
   - Ensure `PORT=5000` is set
   - If not set, add it

2. **Verify Port Detection**:
   - After deployment, go to service → "Networking" tab
   - Check what port is exposed
   - Should show port 5000

3. **If Port Still Wrong**:
   - Check deployment logs for "Server running on port XXXX"
   - The app should log the actual port it's using
   - If it says port 8080, the PORT environment variable isn't being read

4. **Force Port Detection**:
   - Ensure your `package.json` start script is: `"start": "node dist/server.js"`
   - The server.ts file uses: `const PORT = process.env.PORT || 5000;`
   - Zeabur should inject the PORT variable automatically

5. **Alternative Solution**:
   - Remove PORT from environment variables
   - Let Zeabur automatically assign and inject the PORT
   - Your app will adapt to whatever port Zeabur provides
   - This is actually the recommended approach for Zeabur

**Why this happens**: Zeabur tries to auto-detect the port by scanning your code. If it finds multiple port references or can't determine the port, it defaults to 8080. Setting PORT=5000 explicitly or letting Zeabur manage it resolves this.

---

## 📊 Monitoring & Maintenance

### Zeabur Monitoring

- Check logs regularly in the service dashboard
- Monitor resource usage and performance metrics
- Set up alerts if available
- Review deployment history for issues

### Netlify Monitoring

- Check build logs for errors
- Monitor bandwidth usage
- Review function logs
- Track deployment frequency

### Database Monitoring

- Monitor MongoDB Atlas for connection issues
- Check database size and performance
- Set up alerts for high usage
- Regular backup verification

---

## 🔐 Security Checklist

- [ ] All credentials rotated from GitHub exposure
- [ ] Environment variables set correctly in Zeabur
- [ ] Environment variables set correctly in Netlify
- [ ] Google OAuth configured with production URLs
- [ ] reCAPTCHA configured with production domains
- [ ] HTTPS enforced on both frontend and backend
- [ ] CORS properly configured
- [ ] Session secrets are strong and unique
- [ ] JWT secret is strong and unique
- [ ] MongoDB connection uses strong password
- [ ] CSP headers updated to allow Zeabur domains

---

## 🚀 Quick Reference

### Environment Variables Summary

**Zeabur (Backend):**
- `NODE_ENV=production`
- `PORT=5000`
- `MONGODB_URI`, `MONGODB_DB_NAME`
- `MAX_SHORTCUT`, `USER_TIMEOUT`
- `JWT_SECRET`, `SESSION_SECRET`
- `CLIENT_URL` (Netlify URL)
- `SMTP_*` variables
- `RECAPTCHA_SECRET_KEY`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`

**Netlify (Frontend):**
- `VITE_RECAPTCHA_SITE_KEY`
- `VITE_API_URL` (Zeabur URL)

### Important URLs

- **Frontend**: `https://your-app-name.netlify.app`
- **Backend**: `https://your-app.zeabur.app`
- **Admin**: `https://your-app-name.netlify.app/admin`

### Zeabur vs Koyeb Migration Notes

If you previously used Koyeb:
- Zeabur has similar deployment workflow
- Automatic deployments on git push
- Built-in domain generation
- Environment variables work the same way
- No credit card required for free tier usage
- Auto-scaling and better resource management

---

## 📞 Support

If you encounter issues:

1. Check logs in Zeabur and Netlify dashboards
2. Verify all environment variables are set correctly
3. Ensure all credentials have been rotated
4. Test API endpoints directly using curl or Postman
5. Check CORS configuration matches your domains
6. Review CSP headers allow connections to Zeabur

---

**Deployment completed! Your URL shortener is now live on Zeabur! 🎉**
