# Google reCAPTCHA v3 Integration

This document explains the Google reCAPTCHA v3 implementation in the Shortcuts App.

## 🔐 Overview

Google reCAPTCHA v3 has been integrated into the following forms:
- ✅ **Login Page** - Protects against automated login attempts
- ✅ **Registration Page** - Prevents bot signups
- ✅ **Contact Form** - Blocks spam messages

## 📋 Features

### Client-Side (React)
- Automatic token generation using `react-google-recaptcha-v3`
- Seamless integration with existing forms
- No user interaction required (invisible reCAPTCHA v3)
- Error handling for failed verifications

### Server-Side (Express)
- Custom middleware for verification (`src/middleware/recaptcha.ts`)
- Two verification modes:
  - **Standard** (`verifyRecaptcha`): Strict verification (score ≥ 0.5)
  - **Lenient** (`verifyRecaptchaLenient`): More permissive (score ≥ 0.3)
- Development mode support (allows testing without valid tokens)
- Detailed logging of verification results

## 🔧 Configuration

### Environment Variables

#### Server (`.env`)
```env
RECAPTCHA_SECRET_KEY=6Lf_CQYsAAAAAIhzt4HiESwQy4ytyRu3ftNF6bQ9
```

#### Client (`client/.env`)
```env
VITE_RECAPTCHA_SITE_KEY=6Lf_CQYsAAAAAGZnHRb5i0-lkM648YVwxuQjbuyg
```

## 🏗️ Architecture

### Client Implementation

1. **App.tsx** - Global reCAPTCHA Provider
```typescript
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

<GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
  {/* App content */}
</GoogleReCaptchaProvider>
```

2. **Form Components** - Token Generation
```typescript
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const { executeRecaptcha } = useGoogleReCaptcha();
const token = await executeRecaptcha('login'); // Action name
```

### Server Implementation

1. **Middleware** (`src/middleware/recaptcha.ts`)
- Verifies tokens with Google's API
- Returns scores (0.0 - 1.0)
- Handles errors gracefully

2. **Route Protection**
```typescript
import { verifyRecaptchaLenient } from '../middleware/recaptcha';

router.post('/login', verifyRecaptchaLenient, authLimiter, ...);
```

## 📊 Score Thresholds

reCAPTCHA v3 returns a score from 0.0 to 1.0:
- **1.0** = Very likely a legitimate user
- **0.5** = Neutral (our standard threshold)
- **0.3** = Lenient threshold (development/testing)
- **0.0** = Very likely a bot

### Current Thresholds
- **Production**: ≥ 0.5 (standard middleware)
- **Development**: ≥ 0.3 (lenient middleware)

## 🔄 Request Flow

### Login/Registration Flow
```
1. User fills form
2. Form submission triggered
3. Client requests reCAPTCHA token from Google
4. Token included in API request
5. Server middleware verifies token with Google
6. If score ≥ threshold: Proceed
7. If score < threshold: Return 400 error
8. Continue with authentication logic
```

## 🧪 Testing

### Development Mode
The lenient middleware (`verifyRecaptchaLenient`) allows development without strict reCAPTCHA:
- Missing tokens are logged but allowed (development only)
- Verification failures are logged but don't block requests (development only)
- Production mode enforces strict validation

### Manual Testing
1. Start the application
2. Open browser console
3. Submit a form (login/register/contact)
4. Check network tab for `recaptchaToken` in request payload
5. Check server logs for verification results

Example server log:
```
✅ reCAPTCHA verified. Score: 0.9, Action: login
```

## 🛡️ Security Features

### Bot Protection
- **Invisible verification**: No user interaction needed
- **Score-based filtering**: Blocks low-scoring requests
- **Rate limiting**: Combined with express-rate-limit
- **Action tracking**: Different actions for different forms

### Privacy
- **Secret key**: Stored server-side only
- **Site key**: Public but domain-restricted
- **No PII**: reCAPTCHA doesn't store form data

## 📝 Protected Endpoints

| Endpoint | Method | Middleware | Action Name |
|----------|--------|------------|-------------|
| `/api/auth/login` | POST | `verifyRecaptchaLenient` | `login` |
| `/api/auth/send-verification` | POST | `verifyRecaptchaLenient` | `register` |
| `/api/contact` | POST | `verifyRecaptchaLenient` | `contact` |

## 🐛 Troubleshooting

### Common Issues

#### "reCAPTCHA not ready" Error
**Cause**: Provider not properly initialized
**Solution**: Ensure `GoogleReCaptchaProvider` wraps the entire app

#### Verification Fails in Development
**Cause**: Invalid keys or network issues
**Solution**: Check `.env` files and ensure keys are correct

#### All Requests Blocked
**Cause**: Threshold too high or legitimate traffic flagged
**Solution**: Adjust threshold in `verifyRecaptchaLenient` (currently 0.3)

### Debug Mode
Enable detailed logging by checking server console output:
```bash
npm run dev
```

Look for:
- `✅ reCAPTCHA verified successfully. Score: X.X`
- `⚠️ reCAPTCHA token missing (development mode - skipping)`
- `❌ reCAPTCHA verification failed`

## 🔄 Updating Keys

If you need to regenerate keys:

1. Visit [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Create new site (v3)
3. Update `.env` files:
   - Server: `RECAPTCHA_SECRET_KEY`
   - Client: `VITE_RECAPTCHA_SITE_KEY`
4. Restart both servers

## 📚 Resources

- [Google reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
- [react-google-recaptcha-v3 Docs](https://www.npmjs.com/package/react-google-recaptcha-v3)
- [Best Practices Guide](https://developers.google.com/recaptcha/docs/v3#interpreting_the_score)

## ✅ Implementation Checklist

- [x] Install dependencies
  - [x] `react-google-recaptcha-v3` (client)
  - [x] `axios` (server)
- [x] Configure environment variables
  - [x] Server `.env`
  - [x] Client `.env`
- [x] Create verification middleware
- [x] Wrap app with provider
- [x] Update forms (Login, Register, Contact)
- [x] Update backend routes
- [x] Test all forms
- [x] Document implementation

## 🎯 Best Practices

1. **Never expose secret key** - Keep it server-side only
2. **Use lenient mode in development** - Easier testing
3. **Monitor scores** - Adjust thresholds based on traffic
4. **Log verification attempts** - Debug and security monitoring
5. **Combine with rate limiting** - Multiple layers of protection
6. **Handle errors gracefully** - User-friendly error messages

## 📞 Support

For issues or questions:
- Check server logs for verification errors
- Verify environment variables are set correctly
- Ensure keys match between Google Console and `.env` files
- Test in development mode first before production deployment
