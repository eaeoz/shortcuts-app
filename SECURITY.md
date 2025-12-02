# 🔐 Security Implementation Guide

This document outlines all security measures implemented in the URL Shortener application.

---

## 📋 Table of Contents

1. [Security Packages](#security-packages)
2. [Authentication & Authorization](#authentication--authorization)
3. [Rate Limiting](#rate-limiting)
4. [Data Validation & Sanitization](#data-validation--sanitization)
5. [Environment Variables](#environment-variables)
6. [Security Headers](#security-headers)
7. [Database Security](#database-security)
8. [Best Practices](#best-practices)

---

## 🛡️ Security Packages

### Installed Security Middleware

| Package | Version | Purpose |
|---------|---------|---------|
| `helmet` | Latest | Sets secure HTTP headers |
| `express-rate-limit` | ^8.2.1 | Rate limiting for API endpoints |
| `express-mongo-sanitize` | Latest | Prevents MongoDB injection attacks |
| `hpp` | Latest | Prevents HTTP Parameter Pollution |
| `compression` | Latest | Compresses responses (DoS mitigation) |
| `bcryptjs` | ^3.0.3 | Password hashing |
| `jsonwebtoken` | ^9.0.2 | JWT token generation and verification |
| `express-validator` | ^7.3.1 | Input validation |

---

## 🔑 Authentication & Authorization

### 1. Password Security

**Hashing**: All passwords are hashed using bcryptjs with 10 salt rounds before storing in database.

```typescript
// Password hashing
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Password verification
const isMatch = await bcrypt.compare(password, user.password);
```

### 2. JWT Authentication

**Token Storage**: JWTs are stored in HTTP-only cookies to prevent XSS attacks.

**Token Configuration**:
- **Expiry**: 24 hours
- **HTTP Only**: true (prevents JavaScript access)
- **Secure**: true in production (HTTPS only)
- **SameSite**: Lax (CSRF protection)

### 3. Session Security

```typescript
session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevents XSS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }
})
```

### 4. OAuth 2.0 (Google)

- Uses Passport.js with Google OAuth 2.0 strategy
- Secure callback URLs
- State parameter for CSRF protection

### 5. Role-Based Access Control (RBAC)

**User Roles**:
- `user` - Regular user (default)
- `admin` - Administrator with full access

**Admin Middleware** (`src/middleware/auth.ts`):
```typescript
export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};
```

---

## 🚦 Rate Limiting

### Public Endpoints

| Endpoint | Limit | Window | Purpose |
|----------|-------|--------|---------|
| `/api/health` | 30 requests | 5 minutes | Health check monitoring |
| `/api/status` | 100 requests | 15 minutes | API status checks |
| `/api/settings` | 100 requests | 15 minutes | Public settings |
| `/api/contact` | 10 requests | 15 minutes | Contact form submissions |

### Authentication Endpoints

| Endpoint | Limit | Window | Purpose |
|----------|-------|--------|---------|
| `/api/auth/register` | Rate limited | - | Prevent mass registrations |
| `/api/auth/login` | Rate limited | - | Prevent brute force attacks |
| `/api/password-reset` | Rate limited | - | Prevent abuse |

### Rate Limit Response

When rate limited, clients receive:
```json
{
  "error": "Too many requests from this IP, please try again after X minutes"
}
```

**HTTP Status Code**: `429 Too Many Requests`

**Headers**: `RateLimit-*` headers provide limit information

---

## 🧹 Data Validation & Sanitization

### 1. MongoDB Injection Prevention

**express-mongo-sanitize**: Removes any keys that start with `$` or contain `.` from user input.

```typescript
// Bad request example (blocked):
{
  "email": { "$gt": "" },  // MongoDB operator injection
  "password": "anything"
}
```

### 2. Input Validation

**express-validator**: Validates and sanitizes all user inputs.

**Example validations**:
- Email format validation
- Password strength requirements (min 6 characters)
- URL validation for shortcut creation
- Short code format validation (4-10 alphanumeric characters)

### 3. HTTP Parameter Pollution (HPP)

**hpp**: Prevents duplicate parameter attacks.

```typescript
// Bad request example (blocked):
GET /api/shortcuts?sort=asc&sort=desc&sort=random
```

---

## 🔒 Security Headers

### Helmet Configuration

Helmet sets the following HTTP headers:

#### 1. Content Security Policy (CSP)
```typescript
{
  defaultSrc: ["'self'"],
  styleSrc: ["'self'", "'unsafe-inline'"],
  scriptSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'", "data:", "https:"]
}
```

#### 2. X-Content-Type-Options
Prevents MIME type sniffing: `nosniff`

#### 3. X-Frame-Options
Prevents clickjacking: `SAMEORIGIN`

#### 4. X-XSS-Protection
Legacy XSS protection: `1; mode=block`

#### 5. Strict-Transport-Security (HSTS)
Forces HTTPS in production: `max-age=31536000; includeSubDomains`

#### 6. X-Powered-By
Removed to hide Express.js

---

## 🗄️ Database Security

### 1. Connection Security

**MongoDB URI**: Uses secure connection string with authentication:
```
mongodb+srv://username:password@cluster.mongodb.net/database
```

**Best Practices**:
- ✅ Strong database user password
- ✅ Network access restrictions in MongoDB Atlas
- ✅ Database-level encryption (MongoDB Atlas)
- ✅ Connection string in environment variables

### 2. Schema Validation

Mongoose schemas enforce data types and required fields:

```typescript
// Example: User Schema
{
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}
```

### 3. Query Sanitization

All database queries are sanitized through:
- MongoDB sanitization middleware
- Mongoose schema validation
- Input validation before queries

---

## 🌐 Environment Variables

### Required Variables

Create a `.env` file with these variables (NEVER commit this file):

```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
MONGODB_DB_NAME=shortcuts

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this
SESSION_SECRET=your-session-secret-key-change-this

# Server
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Email (Yandex SMTP)
SMTP_HOST=smtp.yandex.com
SMTP_PORT=587
SMTP_USER=your-email@yandex.com
SMTP_PASS=your-app-password
RECIPIENT_EMAIL=admin@example.com

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# reCAPTCHA
RECAPTCHA_SECRET_KEY=your-recaptcha-secret
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key

# Application
MAX_SHORTCUT=10
USER_TIMEOUT=1440
```

### Security Tips

1. **Never commit `.env` files** - Use `.gitignore`
2. **Use strong secrets** - At least 32 characters, random
3. **Rotate credentials regularly** - Especially after exposure
4. **Use different secrets** - For development and production

---

## 🔐 Additional Security Measures

### 1. CORS Configuration

```typescript
cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:8888' // Netlify Dev
  ],
  credentials: true
})
```

**Benefits**:
- Restricts API access to specific origins
- Prevents unauthorized cross-origin requests
- Allows credentials (cookies) from trusted origins

### 2. Cookie Security

All cookies are configured with:
- `httpOnly: true` - Prevents JavaScript access (XSS protection)
- `secure: true` - HTTPS only in production
- `sameSite: 'lax'` - CSRF protection

### 3. Response Compression

Compression middleware reduces response size:
- Saves bandwidth
- Faster response times
- Mitigates some DoS attacks

### 4. Email Verification

New user registrations require email verification:
1. User registers with email/password
2. Verification token sent via email
3. User clicks link to verify
4. Account activated

### 5. reCAPTCHA Protection

reCAPTCHA v2 protects:
- Registration forms
- Login forms
- Contact forms
- Password reset requests

### 6. Logout Mechanism

Secure logout implementation:
- Clears JWT cookie
- Destroys session
- Returns success response

---

## ✅ Security Checklist

### Development

- [x] All passwords hashed with bcrypt
- [x] JWT tokens in HTTP-only cookies
- [x] Rate limiting on all public endpoints
- [x] Input validation with express-validator
- [x] MongoDB injection prevention
- [x] XSS protection with helmet
- [x] CSRF protection with SameSite cookies
- [x] CORS configured properly
- [x] Environment variables for secrets
- [x] Email verification for new users
- [x] reCAPTCHA on sensitive forms
- [x] Role-based access control

### Production Deployment

- [ ] Change all default secrets
- [ ] Enable HTTPS (secure cookies)
- [ ] Set NODE_ENV=production
- [ ] Update CORS origins
- [ ] Enable MongoDB Atlas IP whitelist
- [ ] Set up monitoring and alerts
- [ ] Enable database backups
- [ ] Review rate limit thresholds
- [ ] Update Google OAuth URLs
- [ ] Update reCAPTCHA domains
- [ ] Test all security features

---

## 🚨 Incident Response

### If Credentials Are Exposed

1. **Immediately rotate all credentials**:
   - MongoDB password
   - JWT secret
   - Session secret
   - SMTP password
   - Google OAuth credentials
   - reCAPTCHA keys

2. **Check logs for suspicious activity**:
   - Unusual login attempts
   - Mass registrations
   - API abuse

3. **Notify affected users** if user data was accessed

4. **Review and update** `.gitignore` to prevent future exposures

### Security Monitoring

Monitor for:
- Failed login attempts
- Rate limit violations
- Unusual API usage patterns
- Database query errors
- Authentication failures

---

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)

---

## 🔄 Regular Security Maintenance

### Monthly Tasks

- Review and update dependencies
- Check for security advisories
- Review access logs
- Test authentication flows
- Verify rate limits are effective

### Quarterly Tasks

- Rotate secrets and credentials
- Review and update security policies
- Audit user permissions
- Test disaster recovery procedures

---

## 📞 Reporting Security Issues

If you discover a security vulnerability, please email: `sedatergoz@gmail.com`

**Please do not** open public issues for security vulnerabilities.

---

**Last Updated**: December 2, 2025

**Security Status**: ✅ Production Ready
