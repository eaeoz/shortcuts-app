# Redirect Issue Fix - Fully Dynamic Configuration

## Problem
When clicking on shortcut URLs (e.g., `https://diverter.netlify.app/s/testt`), users were being redirected to the Netlify frontend URL instead of the backend server URL. Additionally, the backend URL was hardcoded in multiple places instead of using environment variables.

## Root Cause
1. **React Router was intercepting `/s/:code` routes** but using an incorrect or missing `VITE_API_URL` environment variable
2. **Configuration was hardcoded** in netlify.toml instead of using environment variables
3. **API proxy was hardcoded** in netlify.toml

## Solution Applied

### 1. Enhanced ShortcutRedirect Component
**File: `client/src/pages/ShortcutRedirect.tsx`**
- Added error handling for missing `VITE_API_URL` environment variable
- Added console logging for debugging redirect URLs
- Displays a user-friendly error message if backend URL is not configured

### 2. Restored React Router Route
**File: `client/src/App.tsx`**
- Restored the `<Route path="/s/:code" element={<ShortcutRedirect />} />` route
- Imported the ShortcutRedirect component

### 3. Removed ALL Hardcoded URLs from Netlify Config
**File: `client/netlify.toml`**
- ✅ Removed the hardcoded `/s/*` redirect rule
- ✅ Removed the hardcoded `/api/*` proxy rule
- Now ONLY contains the catch-all rule for React Router
- **Everything is now dynamic through environment variables!**

### 4. Axios Already Configured for Dynamic API URL
**File: `client/src/lib/axios.ts`**
- Already uses `VITE_API_URL` from environment variables
- No changes needed - it's already perfect!

### 5. Updated Environment Configuration
**File: `client/.env.example`**
- Added clear documentation for `VITE_API_URL`
- Provided examples for local and production environments

## Configuration Steps

### For Netlify Deployment

1. **Go to Netlify Dashboard** → Your Site → **Site Configuration** → **Environment Variables**

2. **Add the following environment variable:**
   - Key: `VITE_API_URL`
   - Value: `https://happy-stepha-netcify-54410937.koyeb.app`

3. **Redeploy the site** to apply the new environment variable

### For Local Development

Create a `.env` file in the `client` directory:

```env
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
VITE_API_URL=http://localhost:5000
```

## How It Works Now

### For Shortcut Redirects (`/s/:code`):
1. User clicks on `https://diverter.netlify.app/s/testt`
2. React Router catches the `/s/:code` route
3. ShortcutRedirect component loads
4. Component reads `VITE_API_URL` from environment variables
5. Component redirects to `${VITE_API_URL}/s/testt`
6. Backend server handles the redirect and increments click count
7. User is redirected to the original URL

### For API Calls (`/api/*`):
1. React app makes API call using axios
2. Axios uses `baseURL` configured from `VITE_API_URL`
3. Request goes directly to backend (e.g., `https://happy-stepha-netcify-54410937.koyeb.app/api/...`)
4. Backend responds with data

## Benefits of This Approach

✅ **Fully Dynamic Configuration** - ALL backend URLs configurable via environment variables  
✅ **Zero Hardcoding** - No hardcoded URLs anywhere in the codebase  
✅ **Single Source of Truth** - One environment variable controls everything  
✅ **Easy Backend Changes** - Change backend URL without touching code  
✅ **Error Handling** - Clear error messages if configuration is missing  
✅ **Environment-Specific** - Different URLs for dev/staging/production  
✅ **Click Tracking Works** - Backend properly increments click counts  
✅ **Debugging Support** - Console logs help troubleshoot redirect issues

## Complete netlify.toml

The `netlify.toml` is now minimal and contains NO hardcoded URLs:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
```

## Testing

After deployment, test by:
1. Creating a new shortcut in your dashboard
2. Clicking the "Open" button
3. Check browser console for redirect URL
4. Verify you are redirected to the original URL
5. Test API calls (login, creating shortcuts, etc.)

If you see an error page about "Backend URL not set", you need to add the `VITE_API_URL` environment variable in Netlify.

## Important Notes

- Environment variables in Vite must start with `VITE_` prefix
- Changes to environment variables require a rebuild/redeploy
- The variable is baked into the build at build-time, not runtime
- For local development, create a `.env` file (not tracked in git)
- **One environment variable (`VITE_API_URL`) now controls both API calls AND shortcut redirects**
