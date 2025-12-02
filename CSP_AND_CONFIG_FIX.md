# Complete Configuration Fix - CSP and Environment Variables

## Issues Found and Fixed

### Issue 1: Hardcoded Backend URL in CSP
**Problem:** The Content-Security Policy in `client/public/_headers` had a hardcoded backend URL, blocking requests when trying to use a different backend.

**Error Message:**
```
Content-Security-Policy: The page's settings blocked the loading of a resource (connect-src) at http://localhost:5000/api/contact
```

**Solution:** Updated CSP to use wildcard pattern for Koyeb domains:
```
connect-src 'self' https://*.koyeb.app http://localhost:5000 https://www.google-analytics.com https://www.google.com
```

### Issue 2: Duplicate _headers Files
**Location:**
1. `client/_headers` - More flexible, allows any Koyeb subdomain
2. `client/public/_headers` - Was using hardcoded URL (NOW FIXED)

**Current Status:** Both files now use `https://*.koyeb.app` pattern

### Issue 3: netlify.toml Had Hardcoded URLs
**Fixed:** Removed all hardcoded backend URLs from `client/netlify.toml`

## Complete Configuration Setup

### 1. Environment Variables

#### Local Development (`client/.env`):
```env
VITE_RECAPTCHA_SITE_KEY=6Lf_CQYsAAAAAGZnHRb5i0-lkM648YVwxuQjbuyg
VITE_API_URL=http://localhost:5000
```

#### Netlify Production:
Go to **Netlify Dashboard** → **Site Configuration** → **Environment Variables**

Add:
```
VITE_RECAPTCHA_SITE_KEY=6Lf_CQYsAAAAAGZnHRb5i0-lkM648YVwxuQjbuyg
VITE_API_URL=https://happy-stepha-netcify-54410937.koyeb.app
```

### 2. Security Headers Configuration

#### `client/_headers`:
```
Content-Security-Policy: ... connect-src 'self' https://*.koyeb.app http://localhost:5000; ...
```

#### `client/public/_headers`:
```
Content-Security-Policy: ... connect-src 'self' https://*.koyeb.app http://localhost:5000 https://www.google-analytics.com https://www.google.com; ...
```

**Key Change:** `https://*.koyeb.app` allows ANY Koyeb subdomain (dynamic!)

### 3. Application Configuration

#### `client/src/lib/axios.ts`:
```typescript
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

#### `client/src/pages/ShortcutRedirect.tsx`:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
window.location.href = `${apiUrl}/s/${code}`;
```

## How the Dynamic System Works

### For Contact Form:
1. User submits contact form
2. Axios uses `VITE_API_URL` from environment
3. CSP allows connection because of `https://*.koyeb.app` pattern
4. Request goes to backend successfully

### For Shortcut Redirects:
1. User clicks shortcut link
2. ShortcutRedirect component reads `VITE_API_URL`
3. Redirects to `${VITE_API_URL}/s/${code}`
4. Backend handles redirect and tracking

### For All API Calls:
1. Application uses axios instance
2. Axios uses `VITE_API_URL` as baseURL
3. CSP allows the connection
4. Requests succeed

## Benefits of This Configuration

✅ **No Hardcoded URLs** - Everything uses environment variables  
✅ **CSP with Wildcards** - `https://*.koyeb.app` allows any Koyeb deployment  
✅ **Environment-Specific** - Different configs for dev/production  
✅ **Easy Backend Changes** - Just update one environment variable  
✅ **Secure** - CSP still blocks unauthorized domains  
✅ **Flexible** - Works with any Koyeb subdomain

## Testing Checklist

After deploying with these changes:

- [ ] Contact form sends emails successfully
- [ ] Shortcut links redirect properly
- [ ] No CSP errors in browser console
- [ ] Login/Register works
- [ ] Dashboard loads shortcuts
- [ ] Admin functions work
- [ ] No "localhost:5000" references in production

## Deployment Steps

1. **Ensure Netlify environment variable is set:**
   ```
   VITE_API_URL=https://happy-stepha-netcify-54410937.koyeb.app
   ```

2. **Build and deploy:**
   ```bash
   cd client
   npm run build
   ```
   
3. **Deploy to Netlify** (via Git push or manual upload)

4. **Test all functionality** using the checklist above

## Troubleshooting

### If Contact Form Still Fails:
1. Check browser console for CSP errors
2. Verify `VITE_API_URL` is set in Netlify environment variables
3. Ensure you redeployed after setting the variable
4. Check Network tab to see what URL is being called

### If Shortcuts Don't Work:
1. Check browser console for error messages
2. Verify the redirect URL in console logs
3. Ensure backend is accessible at `VITE_API_URL`

### If You See CSP Errors:
1. Check which URL is being blocked
2. Verify the CSP pattern in `_headers` files
3. Make sure wildcard `https://*.koyeb.app` is present

## Summary

All hardcoded URLs have been removed. The entire application now uses a single environment variable (`VITE_API_URL`) that can be configured per environment, and the CSP uses wildcard patterns to allow flexible backend deployment URLs.
