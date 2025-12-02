# Shortcuts - URL Shortener Application

A modern, full-stack URL shortener application with user authentication, admin dashboard, Google OAuth, reCAPTCHA protection, and comprehensive security features.

## Features

### User Features
- 🔐 **User Authentication** - Secure login and registration with JWT + Google OAuth
- 🔗 **URL Shortening** - Create custom or auto-generated short URLs
- ✏️ **URL Management** - Edit, delete, and track your shortcuts
- 📊 **Click Analytics** - Track clicks on your shortened URLs
- 🎨 **Custom Short Codes** - Choose your own memorable short codes (min 4 characters)
- 🔄 **Duplicate Prevention** - Real-time validation prevents duplicate URLs and short codes
- 🌓 **Dark/Light Theme** - Toggle between dark and light modes with persistent preference
- 📱 **Fully Responsive** - Optimized for all devices including small mobiles (370px+)
- ⚡ **Real-time Updates** - Instant feedback on all actions
- 📧 **Contact Form** - Get in touch with support via email
- 🔑 **Password Reset** - Secure password recovery via email with token verification
- 🔒 **Change Password** - Update password from user profile
- 📄 **Footer Pages** - Privacy Policy, Terms of Service, About Us

### Authentication Features
- 🔐 **Traditional Auth** - Email/password with JWT tokens
- 🌐 **Google OAuth 2.0** - One-click login with Google account
- 🤖 **reCAPTCHA v2** - Bot protection on registration and sensitive operations
- 🔑 **Forgot Password** - Email-based password reset with secure tokens
- ⏱️ **Session Management** - Configurable session timeout (USER_TIMEOUT)
- 🍪 **HTTP-Only Cookies** - Secure token storage

### Admin Features
- 👥 **User Management** - View, edit, and manage all users
  - Change usernames and emails
  - Toggle user roles (user ↔ admin)
  - Verify/unverify users
  - Delete users (with cascade deletion of shortcuts)
  - Change user passwords administratively
- 🔗 **URL Management** - Monitor and manage all shortcuts
  - View shortcuts by user
  - Delete any shortcut
  - See click statistics
  - Track creation dates
- 📈 **Dashboard Statistics** - View total users, shortcuts, and clicks
- 📊 **Analytics Charts** - Visual representation of top shortcuts with Recharts
- ⚙️ **Site Settings** - Configure site title, icon, logo, and SEO metadata
- 🎨 **Branding Control** - Customize site appearance and identity
- 📱 **Mobile Admin Panel** - Fully responsive admin interface for mobile devices
- 👤 **User Shortcuts Modal** - View and manage shortcuts for specific users
  - Add shortcuts for users
  - Edit user shortcuts
  - Delete user shortcuts
  - View detailed analytics

### Security Features
- 🛡️ **Rate Limiting** - Protection against brute force attacks
  - Login/Register: 5 failed attempts per 15 minutes (smart counting)
  - Password Reset: 5 requests per 15 minutes
  - Contact Form: 5 submissions per 15 minutes
- 🤖 **reCAPTCHA v2** - Bot protection on registration and sensitive forms
- 🔒 **Password Hashing** - bcryptjs with salt (10 rounds)
- 🎫 **JWT Authentication** - Secure token-based auth with expiration
- 🍪 **HTTP-Only Cookies** - Protection against XSS attacks
- ✅ **Input Validation** - Comprehensive validation with express-validator
- 🔐 **Role-Based Access Control** - User and admin roles
- 🌐 **CORS Configuration** - Whitelisted origins only
- 📧 **Email Validation** - Regex pattern matching and duplicate checking
- 🔑 **Password Reset Tokens** - Secure, time-limited reset tokens
- 🚫 **Duplicate Prevention** - Real-time URL and short code duplicate checking

### URL Shortening Features
- ⚡ **Auto-Generation** - Random short codes (6 characters)
- 🎨 **Custom Codes** - User-defined codes (min 4 characters, alphanumeric + hyphens/underscores)
- 🔄 **Duplicate Detection** - Real-time validation prevents:
  - Duplicate URLs (case-insensitive)
  - Duplicate short codes
  - Conflicts during auto-generation (server-side retry logic)
- ✏️ **Edit Mode** - Modify URLs and codes without false duplicate warnings
- 📊 **Click Tracking** - Accurate click counting per shortcut
- ⏱️ **Last Accessed** - Track when shortcuts were last used
- 🎯 **User Limits** - Configurable maximum shortcuts per user (MAX_SHORTCUT)

## Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** - Web framework
- **MongoDB** with **Mongoose** - Database
- **Passport.js** - Authentication middleware
- **Google OAuth 2.0** - Social login
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **express-rate-limit** - DDoS and brute force protection
- **nodemailer** - Email sending (contact form & password reset)
- **cookie-parser** - Cookie handling
- **cors** - Cross-origin resource sharing
- **crypto** - Secure token generation for password reset

### Frontend
- **React 18** with **TypeScript**
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon library
- **Recharts** - Data visualization and charts
- **Context API** - State management (Auth, Theme, Settings)
- **Google reCAPTCHA** - Bot protection integration

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn package manager
- SMTP credentials (for contact form and password reset emails)
- Google OAuth 2.0 credentials (optional, for social login)
- Google reCAPTCHA v2 keys (optional, for bot protection)

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/eaeoz/shortcuts-app.git
cd shortcuts-app
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd client
npm install
cd ..
```

4. **Configure environment variables**

⚠️ **IMPORTANT SECURITY NOTE**: 
- Never commit `.env` files to version control
- Use `.env.example` as a template for required variables
- Keep all credentials and secrets secure
- The `.gitignore` file already excludes `.env` files from Git

Backend `.env` file (root directory):
Copy `.env.example` to `.env` and fill in your actual values:
```bash
cp .env.example .env
```

Frontend `client/.env` file:
Copy `client/.env.example` to `client/.env` and fill in your values:
```bash
cp client/.env.example client/.env
```

Example configuration (replace with your actual values):
```env
# MongoDB Configuration
MONGODB_DB_NAME=shortcuts
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/

# Application Settings
MAX_SHORTCUT=10
USER_TIMEOUT=1440
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Email Configuration (for contact form & password reset)
SMTP_HOST=smtp.yandex.com
SMTP_PORT=587
SMTP_USER=your-email@yandex.com
SMTP_PASS=your-app-password
RECIPIENT_EMAIL=your-email@gmail.com

# Google OAuth 2.0 (Optional)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
SESSION_SECRET=your-session-secret-key-change-in-production

# reCAPTCHA (Optional)
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
```

5. **Set up Google OAuth 2.0** (Optional)

See [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md) for detailed instructions on:
- Creating a Google Cloud project
- Configuring OAuth consent screen
- Generating OAuth 2.0 credentials
- Setting up authorized redirect URIs

6. **Set up Google reCAPTCHA** (Optional)

See [RECAPTCHA_SETUP.md](RECAPTCHA_SETUP.md) for detailed instructions on:
- Registering your site with Google reCAPTCHA
- Getting site and secret keys
- Testing reCAPTCHA locally

7. **Start the development servers**

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Usage

### User Workflow

1. **Register/Login**
   - Navigate to http://localhost:5173
   - **Traditional Registration:**
     - Enter username, email, and password (min 6 characters)
     - Complete reCAPTCHA verification (if enabled)
     - Verify email (if email verification is enabled)
   - **Google OAuth Login:**
     - Click "Sign in with Google" button
     - Authorize with your Google account
     - Automatic account creation or login
   - **Existing Users:**
     - Login with email/username and password
     - Or use "Sign in with Google"
   - Theme preference is saved and persists across sessions

2. **Forgot Password**
   - Click "Forgot Password?" on login page
   - Enter your registered email
   - Check email for password reset link
   - Click link (valid for 1 hour)
   - Set new password
   - Login with new credentials

3. **Create Shortcuts**
   - Click "New Shortcut" button on dashboard
   - Enter the original URL (with http:// or https://)
   - **Duplicate URL Prevention:**
     - Real-time check if URL already has a shortcut
     - Shows existing short code if duplicate found
     - Case-insensitive URL matching
   - Choose generation method:
     - **Auto-generate**: System creates random short code (with collision detection)
     - **Custom**: Enter your own code (min 4 characters, alphanumeric + hyphens/underscores)
   - **Custom Code Validation:**
     - Real-time duplicate checking
     - Green checkmark for available codes
     - Red border and error for taken codes
   - Click "Create Shortcut"
   - Maximum 10 shortcuts per user (configurable via MAX_SHORTCUT)

4. **Manage Shortcuts**
   - View all your shortcuts on the dashboard with click counts
   - Copy short links to clipboard with one click
   - Edit shortcut details (URL and custom code)
   - **Edit Mode Features:**
     - Can keep same URL without false duplicate warnings
     - Can keep same code without false duplicate warnings
     - Validates new URLs and codes against other shortcuts
   - Delete shortcuts you no longer need (with confirmation)
   - Track clicks and creation dates
   - Beautiful card-based responsive layout

5. **Access Shortened URLs**
   - Use the format: `http://localhost:5000/s/YOUR_SHORT_CODE`
   - Automatically redirects to the original URL
   - Click count increments with each visit
   - Last accessed timestamp updates

6. **Change Password**
   - Navigate to profile/settings
   - Enter current password
   - Enter new password (min 6 characters)
   - Confirm new password
   - Password updated securely

7. **Contact Support**
   - Navigate to the Contact page from footer
   - Fill out the form with your name, email, subject, and message
   - Complete reCAPTCHA verification (if enabled)
   - Receive confirmation when message is sent
   - Emails are sent via SMTP to configured recipient

### Admin Workflow

1. **Create Admin User**
   - Register a regular user account
   - Connect to MongoDB directly and change the user's `role` field to "admin"
   - Or promote existing users from the admin panel once you have initial admin access

2. **Access Admin Panel**
   - Login with admin credentials
   - "Admin" link appears in navigation bar
   - Access restricted to users with admin role
   - Fully responsive interface for mobile and desktop

3. **Admin Dashboard**
   - View comprehensive statistics:
     - Total users registered
     - Total shortcuts created
     - Total clicks across all shortcuts
   - See top 10 performing shortcuts with bar charts
   - Visual analytics with Recharts
   - Real-time data updates
   - Responsive card layout for mobile

4. **Manage Users**
   - **Desktop View**: Full table with all user information
   - **Mobile View**: Responsive card layout (370px+)
   - Search users by username or email
   - Sort by: Username, Email, or Creation Date
   - View user details:
     - Username and email
     - Role (user/admin)
     - Verification status (verified/unverified)
     - Creation date
   - **User Actions:**
     - **Edit**: Update username, email, and role
     - **Change Password**: Administratively change user password
     - **Toggle Role**: Switch between user and admin roles
     - **Toggle Verification**: Verify or unverify users
     - **Delete**: Remove user account (with cascade deletion)
     - **View Shortcuts**: Open modal to see user's shortcuts
   - All changes confirmed before execution

5. **View User Shortcuts**
   - Click on username to open shortcuts modal
   - See all shortcuts for specific user
   - View detailed information:
     - Short code with clicks
     - Original URL
     - Creation date
   - **User Shortcut Management:**
     - Add new shortcuts for the user
     - Edit existing shortcuts
     - Delete shortcuts
     - Open shortcuts in new tab
   - Modal is fully responsive for mobile devices

6. **Manage URLs (All Shortcuts)**
   - **Desktop View**: Full table with shortcut details
   - **Mobile View**: Responsive card layout with:
     - Short code and click counter
     - Target URL in contained box
     - Owner username with avatar
     - Delete action
   - Search shortcuts by code or URL
   - Sort by: Clicks, Short Code, or Owner
   - View shortcut details:
     - Short code
     - Original URL (truncated in table)
     - Owner username and avatar
     - Total clicks
   - Delete any shortcut with confirmation
   - Click owner name to view their shortcuts

7. **Site Settings**
   - Update site title (appears in browser tab)
   - Configure site icon URL (favicon)
   - Set site logo URL (in header)
   - Update SEO description (meta description)
   - Set SEO keywords (meta keywords)
   - Changes apply immediately across the site
   - Accessible to all authenticated users

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (rate limited, reCAPTCHA protected)
- `POST /api/auth/login` - Login user (rate limited)
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/password-reset/request` - Request password reset (rate limited)
- `POST /api/password-reset/reset` - Reset password with token
- `POST /api/password-reset/validate-token` - Validate reset token

### User Management (Protected)
- `PUT /api/user/change-password` - Change user password

### Shortcuts (Protected)
- `GET /api/shortcuts` - Get user's shortcuts
- `POST /api/shortcuts` - Create new shortcut (with duplicate validation)
- `PUT /api/shortcuts/:id` - Update shortcut (with duplicate validation)
- `DELETE /api/shortcuts/:id` - Delete shortcut

### Admin (Admin Only)
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user (username, email, role)
- `PUT /api/admin/users/:id/role` - Update user role
- `PUT /api/admin/users/:id/verify` - Toggle user verification
- `PUT /api/admin/users/:id/change-password` - Change user password administratively
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/users/:userId/shortcuts` - Get shortcuts for specific user
- `POST /api/admin/users/:userId/shortcuts` - Create shortcut for user
- `PUT /api/admin/users/:userId/shortcuts/:id` - Update user's shortcut
- `DELETE /api/admin/users/:userId/shortcuts/:id` - Delete user's shortcut
- `GET /api/admin/shortcuts` - Get all shortcuts
- `DELETE /api/admin/shortcuts/:id` - Delete shortcut
- `GET /api/admin/settings` - Get site settings
- `PUT /api/admin/settings` - Update site settings

### Public Endpoints
- `GET /s/:shortCode` - Redirect to original URL (increments clicks)
- `GET /api/settings` - Get site settings (for branding)
- `POST /api/contact` - Send contact form email (rate limited, reCAPTCHA protected)

## Project Structure

```
shortcuts-app/
├── src/                      # Backend source code
│   ├── config/              # Configuration files
│   │   ├── database.ts      # MongoDB connection setup
│   │   └── passport.ts      # Passport.js & Google OAuth config
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts          # JWT authentication middleware
│   │   └── recaptcha.ts     # reCAPTCHA verification middleware
│   ├── models/              # Mongoose models
│   │   ├── User.ts          # User schema with roles & OAuth
│   │   ├── Shortcut.ts      # Shortcut schema with analytics
│   │   └── Settings.ts      # Site settings schema
│   ├── routes/              # API route handlers
│   │   ├── auth.ts          # Authentication routes (JWT + Google OAuth)
│   │   ├── password-reset.ts # Password reset routes
│   │   ├── user.ts          # User management routes
│   │   ├── shortcuts.ts     # Shortcut CRUD with duplicate validation
│   │   ├── admin.ts         # Admin panel operations
│   │   └── contact.ts       # Contact form email handler
│   └── server.ts            # Express server & middleware setup
├── client/                  # Frontend React app
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Navbar.tsx               # Navigation with theme toggle
│   │   │   ├── Footer.tsx               # Footer with page links
│   │   │   ├── ChangePasswordModal.tsx  # User password change
│   │   │   └── AdminChangePasswordModal.tsx # Admin password change
│   │   ├── context/         # React context providers
│   │   │   ├── AuthContext.tsx      # Authentication state
│   │   │   ├── ThemeContext.tsx     # Dark/light theme
│   │   │   └── SettingsContext.tsx  # Site settings
│   │   ├── lib/             # Utility functions
│   │   │   └── axios.ts     # Axios instance with interceptors
│   │   ├── pages/           # Page components
│   │   │   ├── Login.tsx               # Login with Google OAuth
│   │   │   ├── Register.tsx            # Registration with reCAPTCHA
│   │   │   ├── ForgotPassword.tsx      # Password reset request
│   │   │   ├── Dashboard.tsx           # User dashboard (responsive)
│   │   │   ├── Contact.tsx             # Contact form with reCAPTCHA
│   │   │   ├── About.tsx               # About us page
│   │   │   ├── PrivacyPolicy.tsx       # Privacy policy
│   │   │   ├── Terms.tsx               # Terms of service
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.tsx  # Admin stats & analytics
│   │   │       ├── AdminManage.tsx     # User & URL management (responsive)
│   │   │       └── AdminSettings.tsx   # Site settings editor
│   │   ├── App.tsx          # Main app with routing
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles & Tailwind
│   ├── .env                 # Frontend environment variables
│   └── package.json
├── .env                     # Backend environment variables
├── GOOGLE_OAUTH_SETUP.md    # Google OAuth setup guide
├── RECAPTCHA_SETUP.md       # reCAPTCHA setup guide
├── MIGRATION.md             # Database migration guide
├── tsconfig.json            # TypeScript configuration
└── package.json             # Backend dependencies
```

## Security Features Details

### Rate Limiting
**Authentication Endpoints** (`/api/auth/login`, `/api/auth/register`):
- 5 failed attempts per IP per 15 minutes
- Smart counting: successful logins don't count toward limit
- Automatic reset after time window
- Protects against brute force password attacks

**Password Reset** (`/api/password-reset/*`):
- 5 requests per IP per 15 minutes
- Prevents password reset abuse
- Secure token generation with crypto

**Contact Form** (`/api/contact`):
- 5 submissions per IP per 15 minutes
- Prevents spam and abuse
- reCAPTCHA verification required

### Password Security
- Passwords hashed using bcryptjs with salt rounds (10)
- Minimum 6 character requirement
- Never stored in plain text
- Secure comparison using bcrypt.compare()
- Password reset tokens hashed before storage
- Tokens expire after 1 hour

### JWT Tokens
- Signed with secret key from environment
- Configurable expiration time (default: 24 hours via USER_TIMEOUT)
- Stored in HTTP-only cookies
- Validated on each protected request
- Automatic token refresh on activity

### Input Validation
- Email format validation with regex
- Email uniqueness check on registration
- Username length validation (min 3 characters)
- Username uniqueness check on registration
- URL format validation for shortcuts (http/https required)
- Short code pattern validation (alphanumeric + hyphens/underscores)
- Duplicate URL prevention (case-insensitive)
- Duplicate short code prevention
- Sanitization of user inputs
- reCAPTCHA verification on sensitive forms

### reCAPTCHA Protection
- Google reCAPTCHA v2 ("I'm not a robot" checkbox)
- Protects registration and contact forms
- Server-side verification
- Configurable via environment variables
- Gracefully degrades if not configured

### Google OAuth 2.0
- Secure authentication via Google accounts
- Automatic user creation for new Google users
- Links existing accounts by email
- No password required for OAuth users
- Secure token handling with Passport.js

## Mobile Responsiveness

### User Dashboard
- Fully responsive card-based layout
- Optimized for screens down to 370px width
- Touch-friendly buttons and controls
- Adaptive spacing and font sizes
- Smooth animations and transitions

### Admin Panel
- **Users Tab**: Responsive card view for mobile
  - Compact user information cards
  - Touch-friendly action buttons
  - Grid layout for actions (4 columns)
  - Truncated text for long emails
  - Status badges and role indicators

- **Shortcuts Tab**: Responsive card view for mobile
  - Short code with click counter
  - URL in contained box with line clamping
  - Owner information with avatar
  - Delete action button
  - Compact, space-efficient design

- **Mobile Breakpoints**:
  - < 1024px (lg): Card view
  - ≥ 1024px (lg): Table view
  - Tested on 370px - 400px devices
  - Optimized for iPhone SE and similar

## Email Configuration

The application uses Nodemailer with SMTP for:
1. Contact form submissions
2. Password reset emails

### Yandex Mail
```env
SMTP_HOST=smtp.yandex.com
SMTP_PORT=587
SMTP_USER=your-email@yandex.com
SMTP_PASS=your-app-password
```

### Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # Use App Password, not account password
```

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

**Note:** Enable "Less secure app access" or use app-specific passwords for Gmail/Outlook.

## Development

### Available Scripts

**Backend:**
- `npm run dev` - Start backend with nodemon (auto-restart on changes)
- `npm run server` - Start backend development server
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

**Frontend:**
- `npm run client` - Start Vite development server
- `cd client && npm run dev` - Alternative way to start frontend
- `cd client && npm run build` - Build frontend for production
- `cd client && npm run preview` - Preview production build

### Debugging Tips

**Backend Issues:**
- Check MongoDB connection in console logs
- Verify environment variables are loaded
- Check API responses in terminal
- Enable debug mode with `NODE_ENV=development`
- Check Passport.js Google OAuth configuration

**Frontend Issues:**
- Check browser console for errors
- Verify API URL in `client/.env`
- Check network tab for API calls
- Clear browser cache and localStorage
- Verify reCAPTCHA keys are correct

**Email Issues:**
- Verify SMTP credentials
- Check spam folder for test emails
- Test with simple SMTP testing tools
- Enable "Allow less secure apps" for Gmail
- Check password reset token expiration

**OAuth Issues:**
- Verify Google OAuth credentials
- Check authorized redirect URIs
- Ensure OAuth consent screen is configured
- Check browser console for OAuth errors

**reCAPTCHA Issues:**
- Verify site and secret keys match
- Check domain whitelist in reCAPTCHA console
- Test with localhost domains enabled
- Check browser console for reCAPTCHA errors

## Production Deployment

### Security Best Practices

⚠️ **CRITICAL SECURITY REMINDERS**:

1. **Never commit sensitive data**:
   - `.env` files are excluded via `.gitignore`
   - Use `.env.example` files as templates
   - Never hardcode credentials in source code
   - Review all commits before pushing

2. **Credential Management**:
   - Use strong, unique secrets for production
   - Rotate credentials periodically
   - Use environment variable management tools
   - Keep production and development credentials separate

3. **Repository Security**:
   - The `.gitignore` already protects `.env` files
   - `.env.example` files contain no actual credentials
   - Review `.git` history if migrating from other repos
   - Use GitHub's secret scanning if available

### 1. Environment Setup
```env
NODE_ENV=production
JWT_SECRET=generate-strong-secret-key-here
MONGODB_URI=your-production-mongodb-uri
CLIENT_URL=https://your-domain.com

# Google OAuth (Production)
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/callback
SESSION_SECRET=your-production-session-secret

# reCAPTCHA (Production)
RECAPTCHA_SECRET_KEY=your-production-recaptcha-secret
VITE_RECAPTCHA_SITE_KEY=your-production-recaptcha-site-key
```

### 2. Build Application
```bash
# Build backend
npm run build

# Build frontend
cd client && npm run build
```

### 3. Deployment Options

**Backend (API):**
- Railway: Git-based deployment with MongoDB plugin
- Heroku: Easy deployment with Heroku CLI + MongoDB Atlas
- DigitalOcean: VPS with PM2 process manager
- AWS EC2: Full control with Docker containers

**Frontend:**
- Vercel: Automatic deployments from Git
- Netlify: CI/CD with GitHub integration
- Cloudflare Pages: Fast CDN distribution
- Traditional hosting: Build and upload dist/ folder

### 4. Production Checklist

**Security:**
- ✅ No `.env` files committed to repository
- ✅ All credentials stored as environment variables
- ✅ Strong JWT secret generated (min 32 characters)
- ✅ Strong session secret generated
- ✅ Production secrets different from development
- ✅ `.gitignore` properly configured
- ✅ Reviewed git history for exposed secrets
- ✅ HTTPS enabled (SSL certificate)
- ✅ Security headers configured (helmet.js)

**Configuration:**
- ✅ MongoDB production database configured
- ✅ CORS origins set to production domain
- ✅ SMTP credentials for production email
- ✅ Google OAuth production credentials configured
- ✅ Google OAuth authorized redirect URIs updated
- ✅ reCAPTCHA production keys configured
- ✅ reCAPTCHA domain whitelist updated
- ✅ Environment variables set on hosting platform
- ✅ Rate limiting configured appropriately
- ✅ Password reset token expiration configured
- ✅ File upload limits set

**Monitoring:**
- ✅ Error logging and monitoring setup
- ✅ Database backups configured
- ✅ CDN for static assets (optional)

## Troubleshooting

### Common Issues

**"Cannot connect to MongoDB"**
- Check MongoDB URI is correct
- Verify IP whitelist in MongoDB Atlas
- Ensure database user has proper permissions
- Check network connectivity

**"CORS error"**
- Verify CLIENT_URL in backend .env
- Check frontend is running on correct port
- Ensure both origins are allowed in CORS config
- Check for trailing slashes in URLs

**"Rate limit exceeded"**
- Wait 15 minutes for limit to reset
- Check if you're using correct credentials
- Verify IP address isn't blocked
- Use different browser/incognito mode for testing

**"Email not sending"**
- Verify SMTP credentials
- Check SMTP server allows connections
- Enable "Less secure apps" for Gmail
- Use app-specific password
- Check spam folder
- Verify SMTP_PORT is correct

**"Google OAuth not working"**
- Verify Google OAuth credentials are correct
- Check authorized redirect URIs match exactly
- Ensure OAuth consent screen is configured
- Check CLIENT_URL matches OAuth settings
- Clear browser cookies and try again

**"reCAPTCHA not showing"**
- Verify reCAPTCHA site key is correct
- Check domain is whitelisted in reCAPTCHA console
- Enable localhost in reCAPTCHA settings for development
- Check browser console for errors
- Ensure reCAPTCHA script is loaded

**"Password reset not working"**
- Check SMTP email configuration
- Verify token hasn't expired (1 hour limit)
- Check spam folder for reset email
- Ensure CLIENT_URL is correct in reset link
- Check database for reset token

**"Duplicate short code error"**
- This is expected behavior - code is already taken
- Try a different custom code
- Or use auto-generation instead
- System retries auto-generation up to 5 times

## Migration Guide

If you're upgrading from an older version, see [MIGRATION.md](MIGRATION.md) for:
- Database schema changes
- New environment variables
- Breaking changes
- Migration scripts

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Write TypeScript with proper types
- Follow existing code style
- Add comments for complex logic
- Test on both desktop and mobile
- Update README for new features
- Check for console errors

## License

ISC

## Author

Shortcuts Team

## Support

For issues and questions, please:
- Open an issue on GitHub
- Use the contact form in the application
- Email: sedatergoz@gmail.com

## Changelog

### Version 2.0.0 (Latest)
- ✨ Added Google OAuth 2.0 authentication
- 🤖 Added reCAPTCHA v2 bot protection
- 🔑 Added forgot password functionality
- 🔒 Added user password change feature
- 🔐 Added admin password change feature
- 🔄 Added duplicate URL/code validation
- 📱 Made admin panel fully responsive (370px+)
- 👥 Added user shortcuts management modal
- ✏️ Added edit user functionality for admins
- 🚀 Improved error handling and user feedback
- 🎨 Enhanced UI/UX with better animations
- 📊 Added real-time validation indicators

### Version 1.0.0
- Initial release with core features
- JWT authentication
- URL shortening with custom codes
- Admin dashboard with statistics
- Contact form
- Dark/light theme toggle
- Rate limiting
- Responsive design

## Acknowledgments

- Built with modern React 18 and Node.js
- Authentication powered by Passport.js
- UI inspired by modern design principles
- Icons by Lucide React
- Charts by Recharts
- Styling with Tailwind CSS
- Bot protection by Google reCAPTCHA
- OAuth by Google Identity Platform
