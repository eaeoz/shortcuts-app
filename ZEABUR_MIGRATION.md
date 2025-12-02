# 🔄 Koyeb to Zeabur Migration Guide

This guide helps you migrate your backend deployment from Koyeb to Zeabur.

---

## Why Migrate to Zeabur?

- **No credit card required** for free tier
- Better free tier limits
- Automatic deployments on git push
- Simpler configuration
- Better resource management
- Similar workflow to Koyeb

---

## 📋 Pre-Migration Checklist

Before starting the migration:

- [ ] Note your current Koyeb backend URL (e.g., `https://your-app.koyeb.app`)
- [ ] Export all environment variables from Koyeb
- [ ] Verify MongoDB connection is working
- [ ] Ensure you have access to:
  - Google OAuth credentials
  - reCAPTCHA keys
  - SMTP credentials
  - All other secrets

---

## 🚀 Migration Steps

### Step 1: Deploy to Zeabur

1. **Create Zeabur Account**:
   - Go to https://zeabur.com
   - Sign up with GitHub

2. **Create New Project**:
   - Click "New Project"
   - Choose a region
   - Name your project

3. **Deploy Service**:
   - Click "Deploy New Service"
   - Choose GitHub
   - Select your `shortcuts-app` repository
   - Branch: `main`

4. **Configure Build**:
   - Service name: `shortcuts-backend`
   - Root directory: `/`
   - Build command: `npm run build`
   - Start command: `npm start`
   - Port: Will auto-detect (5000)

### Step 2: Set Environment Variables

Copy all environment variables from Koyeb to Zeabur:

```env
NODE_ENV=production
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://sedat:YOUR_PASSWORD@cluster0.aqhcv7a.mongodb.net/shortcuts
MONGODB_DB_NAME=shortcuts

# Application
MAX_SHORTCUT=10
USER_TIMEOUT=1440
JWT_SECRET=your-jwt-secret
CLIENT_URL=https://your-netlify-app.netlify.app

# Email
SMTP_HOST=smtp.yandex.com
SMTP_PORT=587
SMTP_USER=sedatergoz@yandex.com
SMTP_PASS=your-smtp-password
RECIPIENT_EMAIL=sedatergoz@gmail.com

# reCAPTCHA
RECAPTCHA_SECRET_KEY=your-recaptcha-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=https://your-app.zeabur.app/api/auth/google/callback
```

**Important**: Update `GOOGLE_CALLBACK_URL` with your new Zeabur domain!

### Step 3: Generate Domain

1. Go to service → "Networking" tab
2. Click "Generate Domain"
3. Note your Zeabur URL: `https://your-app.zeabur.app`

### Step 4: Update Frontend Configuration

1. **Update Netlify Environment Variables**:
   - Go to Netlify → Site settings → Environment variables
   - Update `VITE_API_URL` to your new Zeabur URL:
     ```
     VITE_API_URL=https://your-app.zeabur.app
     ```

2. **Redeploy Netlify**:
   - Go to Deploys tab
   - Click "Trigger deploy" → "Clear cache and deploy site"

### Step 5: Update External Services

1. **Update Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Edit OAuth 2.0 Client
   - Update Authorized redirect URIs:
     ```
     Remove: https://your-app.koyeb.app/api/auth/google/callback
     Add: https://your-app.zeabur.app/api/auth/google/callback
     ```

2. **Update reCAPTCHA Domains**:
   - Go to [reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
   - Edit your site
   - Update domains:
     ```
     Remove: your-app.koyeb.app
     Add: your-app.zeabur.app
     ```

### Step 6: Test the Migration

1. **Test API Connection**:
   ```bash
   curl https://your-app.zeabur.app/api/health
   ```

2. **Test Frontend**:
   - Visit your Netlify URL
   - Try logging in
   - Test creating a shortcut
   - Test Google OAuth login

3. **Check Logs**:
   - Monitor Zeabur logs for any errors
   - Check Netlify function logs

### Step 7: Decommission Koyeb (Optional)

Once everything is working on Zeabur:

1. Verify all functionality works for 24-48 hours
2. Delete or pause your Koyeb service
3. Update any documentation with new URLs

---

## 📝 Updated Files Checklist

Make sure these files are updated with Zeabur references:

- [x] `DEPLOYMENT_GUIDE.md` - Main deployment instructions
- [x] `client/_headers` - CSP allows `https://*.zeabur.app`
- [x] `client/public/_headers` - CSP allows `https://*.zeabur.app`
- [ ] Update any local `.env` files if needed
- [ ] Update README if it mentions deployment

---

## 🐛 Troubleshooting Migration Issues

### Issue: Frontend can't connect to backend

**Solution**:
1. Check Netlify environment variables
2. Ensure `VITE_API_URL` is set to correct Zeabur URL
3. Redeploy Netlify after changing variables
4. Check browser console for CORS errors

### Issue: CORS errors

**Solution**:
1. Verify `CLIENT_URL` in Zeabur matches your Netlify URL exactly
2. Check CSP headers in `client/_headers` and `client/public/_headers`
3. Ensure they include `https://*.zeabur.app`

### Issue: Google OAuth not working

**Solution**:
1. Verify callback URL in Google Console matches Zeabur URL
2. Check `GOOGLE_CALLBACK_URL` environment variable in Zeabur
3. Ensure both authorized origins and redirect URIs are updated

### Issue: Service won't start

**Solution**:
1. Check Zeabur logs for specific errors
2. Verify all environment variables are set
3. Ensure build command is `npm run build`
4. Confirm start command is `npm start`

### Issue: Zeabur uses wrong port (8080 instead of 5000)

**Solution**:

Your app is configured to use `process.env.PORT || 5000`, which is correct. Here's how to fix the port issue:

1. **Set PORT Environment Variable**:
   - Go to Zeabur service → Variables tab
   - Add or update: `PORT=5000`
   - Click "Redeploy"

2. **Verify in Logs**:
   - Check deployment logs
   - Look for "Server running on port 5000"
   - If it shows different port, variable isn't loading

3. **Check Networking Tab**:
   - Go to service → "Networking" tab
   - Verify exposed port is 5000
   - Generate domain if not already done

4. **Alternative (Let Zeabur Manage)**:
   - Remove PORT from environment variables
   - Zeabur will automatically inject the correct PORT
   - Your app adapts to whatever port Zeabur assigns
   - This is actually the recommended approach

**Why this happens**: Zeabur scans your code to auto-detect the port. If it can't determine it or finds conflicting values, it defaults to 8080. Setting `PORT=5000` explicitly fixes this.

---

## ✅ Post-Migration Verification

After migration is complete:

- [ ] All API endpoints responding correctly
- [ ] User registration working
- [ ] Email notifications sending
- [ ] Google OAuth login functional
- [ ] URL shortening and redirects working
- [ ] Admin panel accessible
- [ ] No CORS errors in browser console
- [ ] Logs showing no critical errors
- [ ] Performance is acceptable

---

## 🔐 Security Notes

- Keep all credentials secure during migration
- Don't expose environment variables
- Update callback URLs immediately after deployment
- Monitor logs for unauthorized access attempts
- Verify HTTPS is enforced on new deployment

---

## 📊 Comparison: Koyeb vs Zeabur

| Feature | Koyeb | Zeabur |
|---------|-------|--------|
| Free Tier Credit Card | Required | Not Required ✅ |
| Auto-deploy on push | Yes | Yes |
| Custom domains | Yes | Yes |
| Environment variables | Yes | Yes |
| Log viewing | Yes | Yes |
| Build logs | Yes | Yes |
| Health checks | Manual | Automatic |
| Resource limits | Lower | Higher ✅ |

---

## 📞 Need Help?

If you encounter issues during migration:

1. Check Zeabur documentation: https://zeabur.com/docs
2. Review the main DEPLOYMENT_GUIDE.md
3. Check Zeabur logs for specific errors
4. Verify all environment variables are correct
5. Test API endpoints directly with curl

---

**Migration Complete! Your app is now running on Zeabur! 🎉**
