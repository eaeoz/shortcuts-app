# Netlify Deployment Checklist

## Critical Issue: Environment Variables Must Be Set BEFORE Building

The error you're seeing (`CORS request did not succeed` with `http://localhost:5000`) means the Netlify deployment doesn't have the `VITE_API_URL` environment variable set, so it's using the fallback localhost URL.

## Step-by-Step Deployment Process

### 1. Set Environment Variables in Netlify Dashboard

**IMPORTANT: Do this FIRST, before deploying!**

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click on your site (**diverter.netlify.app**)
3. Navigate to: **Site configuration** → **Environment variables**
4. Click **Add a variable** or **Add a single variable**
5. Add the following variables:

   **Variable 1:**
   - Key: `VITE_RECAPTCHA_SITE_KEY`
   - Value: `6Lf_CQYsAAAAAGZnHRb5i0-lkM648YVwxuQjbuyg`
   - Scope: All deployments (or select specific scopes)

   **Variable 2:**
   - Key: `VITE_API_URL`
   - Value: `https://happy-stepha-netcify-54410937.koyeb.app`
   - Scope: All deployments

6. Click **Save** for each variable

### 2. Trigger a New Deploy

After setting the environment variables, you MUST redeploy to bake them into the build:

#### Option A: Trigger Deploy from Netlify Dashboard
1. Go to **Deploys** tab
2. Click **Trigger deploy** button
3. Select **Deploy site**
4. Wait for the build to complete

#### Option B: Deploy via Git Push
```bash
# Make sure all changes are committed
git add .
git commit -m "Fix environment configuration"
git push origin main
```

### 3. Verify Environment Variables Are Working

After the new deployment completes:

1. Visit your deployed site: https://diverter.netlify.app
2. Open browser Developer Tools (F12)
3. Go to **Console** tab
4. Type and press Enter:
   ```javascript
   console.log(import.meta.env.VITE_API_URL)
   ```
5. It should output: `https://happy-stepha-netcify-54410937.koyeb.app`
6. If it shows `undefined` or `http://localhost:5000`, the environment variable wasn't set before the build

### 4. Test Functionality

After successful deployment with environment variables:

- [ ] Login/Register works
- [ ] Dashboard loads
- [ ] Can create shortcuts
- [ ] Shortcut redirects work
- [ ] Contact form sends (no CORS errors)
- [ ] No `localhost:5000` in Network tab
- [ ] No CSP errors in Console

## Common Issues and Solutions

### Issue: Still seeing `localhost:5000` in errors
**Solution:** Environment variable wasn't set before building. Go back to Step 1 and 2.

### Issue: "VITE_API_URL is undefined"
**Solution:** 
- Make sure the variable name is exactly `VITE_API_URL` (case-sensitive)
- Must start with `VITE_` prefix for Vite to expose it
- Redeploy after setting

### Issue: CORS errors persist
**Solution:**
1. Check that backend URL is correct and accessible
2. Verify backend has CORS configured for your Netlify domain
3. Make sure `withCredentials: true` is set in axios config (already done)

### Issue: Build fails
**Solution:**
1. Check Netlify build logs for specific errors
2. Verify `package.json` has correct build script
3. Ensure Node version is compatible (set to 20 in netlify.toml)

## Why This Happens

Vite environment variables work differently than traditional environment variables:

1. **Build-time variables:** Vite replaces `import.meta.env.VITE_*` at BUILD TIME
2. **Not runtime:** Unlike server-side env vars, these are baked into the JavaScript bundle
3. **Requires rebuild:** Changing the variable requires a new build to take effect

## Current Configuration Files

### ✅ These are already configured correctly:
- `client/src/lib/axios.ts` - Uses `VITE_API_URL`
- `client/src/pages/ShortcutRedirect.tsx` - Uses `VITE_API_URL`
- `client/netlify.toml` - No hardcoded URLs
- `client/_headers` - CSP allows `https://*.koyeb.app`
- `client/public/_headers` - CSP allows `https://*.koyeb.app`

### ⚠️ What you need to do:
- Set `VITE_API_URL` in Netlify Dashboard
- Redeploy the site

## Quick Verification Script

Run this in your LOCAL development environment to ensure everything is configured:

```bash
cd client

# Check if .env exists
if [ -f .env ]; then
    echo "✓ .env file exists"
    grep VITE_API_URL .env
else
    echo "✗ .env file missing - create it from .env.example"
fi

# Check if dependencies are installed
if [ -d node_modules ]; then
    echo "✓ Dependencies installed"
else
    echo "✗ Run 'npm install'"
fi

# Test local build
echo "Testing build..."
npm run build

echo "Build complete. Check dist folder."
```

## Summary

The fix is simple but CRITICAL:
1. ✅ Code is already configured correctly
2. ✅ CSP headers are already fixed
3. ❌ **YOU NEED TO:** Set `VITE_API_URL` in Netlify Dashboard
4. ❌ **YOU NEED TO:** Redeploy after setting the variable

Once you complete steps 3 and 4, everything will work!
