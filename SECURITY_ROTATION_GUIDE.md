# 🚨 URGENT: Credential Rotation Guide

Your credentials were exposed in Git history and have been removed. However, you MUST rotate all credentials immediately as they may have been accessed.

## ✅ Step 1: Git History Cleaned
- [x] .env removed from local Git history
- [x] Changes force-pushed to GitHub
- [x] Repository is now clean

## 🔄 Step 2: Rotate ALL Credentials (DO THIS NOW!)

### 1. MongoDB Database Password
**Current exposed credentials:**
- Username: `sedat`
- Password: `Sedat_mongodb_12`
- Cluster: `cluster0.aqhcv7a.mongodb.net`

**Action Required:**
1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Navigate to Database Access
3. Click on user `sedat` → Edit
4. Click "Edit Password"
5. Generate a new strong password
6. Update your local `.env` file with the new password

**New MONGODB_URI format:**
```env
MONGODB_URI=mongodb+srv://sedat:YOUR_NEW_PASSWORD@cluster0.aqhcv7a.mongodb.net/shortcuts
```

---

### 2. Yandex SMTP Password
**Current exposed credentials:**
- Email: `sedatergoz@yandex.com`
- App Password: `kxnjfyonubzsrtxa`

**Action Required:**
1. Go to Yandex Mail: https://mail.yandex.com/
2. Click Settings → Security
3. Navigate to "App passwords"
4. Revoke the old app password: `kxnjfyonubzsrtxa`
5. Generate a new app password for your application
6. Update your local `.env` file

**New SMTP configuration:**
```env
SMTP_HOST=smtp.yandex.com
SMTP_PORT=587
SMTP_USER=sedatergoz@yandex.com
SMTP_PASS=YOUR_NEW_APP_PASSWORD
```

---

### 3. Google OAuth Credentials
**Current exposed credentials:**
- Client ID: `746648488193-ff03vs6vcuaetusq31gff4493vu3s94u.apps.googleusercontent.com`
- Client Secret: `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`

**Action Required:**
1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Select your project
3. Navigate to "APIs & Services" → "Credentials"
4. Find your OAuth 2.0 Client ID
5. Click "Delete" on the compromised credentials
6. Create new OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
7. Copy the new Client ID and Client Secret
8. Update your local `.env` file

**New Google OAuth configuration:**
```env
GOOGLE_CLIENT_ID=YOUR_NEW_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_NEW_CLIENT_SECRET
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

---

### 4. reCAPTCHA Keys
**Current exposed credentials:**
- Site Key: `6Lf_CQYsAAAAAGZnHRb5i0-lkM648YVwxuQjbuyg`
- Secret Key: `6Lf_CQYsAAAAAIhzt4HiESwQy4ytyRu3ftNF6bQ9`

**Action Required:**
1. Go to reCAPTCHA Admin: https://www.google.com/recaptcha/admin
2. Delete the old site configuration
3. Create a new reCAPTCHA v2 site
4. Add domains: `localhost`, `127.0.0.1`
5. Copy the new Site Key and Secret Key
6. Update both `.env` files

**Backend .env:**
```env
RECAPTCHA_SECRET_KEY=YOUR_NEW_SECRET_KEY
```

**Frontend client/.env:**
```env
VITE_RECAPTCHA_SITE_KEY=YOUR_NEW_SITE_KEY
```

---

### 5. JWT and Session Secrets
**Current weak secrets:**
- JWT_SECRET: `your-super-secret-jwt-key-change-this-in-production-12345`
- SESSION_SECRET: `your-session-secret-key-change-in-production`

**Action Required:**
Generate strong random secrets (minimum 32 characters):

**Option A - Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option B - Using PowerShell:**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

**Update your .env:**
```env
JWT_SECRET=YOUR_NEW_STRONG_JWT_SECRET_HERE
SESSION_SECRET=YOUR_NEW_STRONG_SESSION_SECRET_HERE
```

---

## ⚠️ CRITICAL: After Rotating All Credentials

1. **Update your local .env file** with all new credentials
2. **Test the application** to ensure everything works
3. **NEVER commit .env file again** - it's already in .gitignore
4. **Consider enabling 2FA** on all services (MongoDB, Google, Yandex)
5. **Monitor for suspicious activity** on your accounts

## 📋 Rotation Checklist

- [ ] MongoDB password changed
- [ ] Yandex SMTP app password rotated
- [ ] Google OAuth credentials regenerated
- [ ] reCAPTCHA keys regenerated
- [ ] JWT secret updated (strong random value)
- [ ] Session secret updated (strong random value)
- [ ] Local .env file updated with all new values
- [ ] Application tested and working
- [ ] Verified .env is NOT in Git staging area (`git status`)

## 🔒 Future Security Best Practices

1. Always use `.env.example` for templates
2. Never commit `.env` files (already protected by .gitignore)
3. Use different credentials for development and production
4. Rotate credentials every 90 days
5. Enable 2FA on all critical services
6. Use secret management tools for production (AWS Secrets Manager, Azure Key Vault, etc.)
7. Review commits before pushing
8. Consider using pre-commit hooks to prevent .env commits

## ✅ Verification

After rotating all credentials, verify:
```bash
# Check .env is not tracked
git status

# Should show: nothing to commit, working tree clean
# .env should not appear in the output
```

---

**TIME SENSITIVE:** Complete these rotations immediately. The credentials were publicly accessible and should be considered compromised.
