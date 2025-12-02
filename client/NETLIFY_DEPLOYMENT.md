# Netlify Deployment Guide for Shortcuts App

This guide will help you deploy the Shortcuts client application to Netlify with the contact form functionality.

## Prerequisites

- A Netlify account (sign up at https://netlify.com)
- Your SMTP credentials ready
- Backend server deployed (e.g., on Koyeb)

## Step 1: Prepare Your Repository

Make sure all your code is committed to your Git repository:

```bash
git add .
git commit -m "Add footer pages and Netlify functions"
git push origin main
```

## Step 2: Connect to Netlify

1. Log in to your Netlify account
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider (GitHub, GitLab, etc.)
4. Select your repository
5. Select the `client` folder as the base directory

## Step 3: Configure Build Settings

Netlify should auto-detect your settings, but verify:

- **Base directory:** `client`
- **Build command:** `npm run build`
- **Publish directory:** `client/dist`
- **Functions directory:** `client/netlify/functions`

## Step 4: Set Environment Variables

In Netlify dashboard, go to:
**Site settings** → **Environment variables** → **Add a variable**

Add the following variables:

```
SMTP_HOST=smtp.yandex.com
SMTP_PORT=587
SMTP_USER=sedatergoz@yandex.com
SMTP_PASS=kxnjfyonubzsrtxa
RECIPIENT_EMAIL=sedatergoz@gmail.com
```

⚠️ **Important:** Never commit these credentials to your repository!

## Step 5: Update Backend URL

In `client/netlify.toml`, update the redirects with your actual backend URL:

```toml
[[redirects]]
  from = "/s/*"
  to = "https://your-actual-backend-url.koyeb.app/s/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/api/*"
  to = "https://your-actual-backend-url.koyeb.app/api/:splat"
  status = 200
  force = true
```

Replace `your-actual-backend-url.koyeb.app` with your actual backend URL.

## Step 6: Deploy

1. Click **Deploy site**
2. Wait for the build to complete
3. Your site will be available at `https://your-site-name.netlify.app`

## Step 7: Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Follow the instructions to configure your DNS

## Testing the Contact Form

1. Visit `https://your-site-name.netlify.app/contact`
2. Fill out the form and submit
3. Check your email at `sedatergoz@gmail.com`

## Troubleshooting

### Contact Form Not Working

1. Check **Functions** tab in Netlify dashboard
2. View function logs for errors
3. Verify all environment variables are set correctly
4. Test the function directly at `/.netlify/functions/contact`

### API Calls Failing

1. Verify backend URL in `netlify.toml`
2. Check CORS settings on your backend
3. Verify redirects are working in **Deploys** → **Deploy log**

### Build Failures

1. Check build logs in Netlify dashboard
2. Verify all dependencies are in `package.json`
3. Ensure Node version matches (18.x)

## File Structure

```
client/
├── netlify/
│   └── functions/
│       └── contact.ts          # Contact form serverless function
├── netlify.toml                # Netlify configuration
├── src/
│   ├── pages/
│   │   ├── About.tsx          # About page
│   │   ├── Contact.tsx        # Contact form page
│   │   ├── PrivacyPolicy.tsx  # Privacy policy
│   │   └── Terms.tsx          # Terms of service
│   └── components/
│       └── Footer.tsx         # Updated footer with links
└── package.json
```

## Features Included

✅ Privacy Policy page (`/privacy`)
✅ Terms of Service page (`/terms`)
✅ About page (`/about`)
✅ Contact form with email (`/contact`)
✅ Serverless contact function
✅ Responsive footer with navigation
✅ Dark mode support
✅ Beautiful email templates

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| SMTP_HOST | SMTP server hostname | smtp.yandex.com |
| SMTP_PORT | SMTP server port | 587 |
| SMTP_USER | Email account for sending | your-email@yandex.com |
| SMTP_PASS | Email account password | your-app-password |
| RECIPIENT_EMAIL | Where to receive contact forms | your-email@gmail.com |

## Security Notes

- Never commit sensitive credentials to Git
- Use Netlify environment variables for all secrets
- SMTP credentials are only accessible to serverless functions
- Contact form includes validation and sanitization

## Support

For issues or questions:
- Check Netlify documentation: https://docs.netlify.com
- Visit the contact page: `/contact`
- Email: sedatergoz@gmail.com

## Next Steps

1. Deploy your backend to Koyeb
2. Update `netlify.toml` with backend URL
3. Deploy client to Netlify
4. Test all functionality
5. Set up custom domain (optional)

Happy deploying! 🚀
