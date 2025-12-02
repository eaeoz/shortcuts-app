# Shortcuts - URL Shortener Application

A modern, full-stack URL shortener application with user authentication, admin dashboard, Google OAuth, reCAPTCHA protection, and comprehensive security features.

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [SECURITY.md](SECURITY.md) | Comprehensive security implementation guide |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Complete deployment instructions |
| [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md) | Google OAuth 2.0 setup guide |
| [RECAPTCHA_SETUP.md](RECAPTCHA_SETUP.md) | reCAPTCHA configuration guide |
| [MIGRATION.md](MIGRATION.md) | Database migration guide |
| [SECURITY_ROTATION_GUIDE.md](SECURITY_ROTATION_GUIDE.md) | Credential rotation procedures |
| [ATTACK_PROTECTION.md](ATTACK_PROTECTION.md) | Attack prevention strategies |
| [CLIENT_SECURITY.md](CLIENT_SECURITY.md) | Client-side security measures |
| [CSP_AND_CONFIG_FIX.md](CSP_AND_CONFIG_FIX.md) | Content Security Policy fixes |
| [NETLIFY_DEPLOYMENT_CHECKLIST.md](NETLIFY_DEPLOYMENT_CHECKLIST.md) | Netlify deployment checklist |
| [REDIRECT_FIX.md](REDIRECT_FIX.md) | Redirect issue fixes |
| [HARDCODED_URLS_FIXED.md](HARDCODED_URLS_FIXED.md) | URL configuration fixes |

## 🚀 Features

### 🔐 Authentication & Security
- **Multi-Method Authentication**
  - Traditional email/password with JWT tokens
  - Google OAuth 2.0 single sign-on
  - HTTP-only secure cookies
  - Configurable session timeout (USER_TIMEOUT)
- **Advanced Security**
  - Password hashing with bcryptjs (10 rounds)
  - Rate limiting on all endpoints (configurable)
  - reCAPTCHA v2 bot protection
  - Role-based access control (User/Admin)
  - CORS configuration with whitelisted origins
  - Security headers via Helmet.js
  - MongoDB injection prevention
  - XSS and CSRF protection
- **Password Management**
  - Forgot password with email recovery
  - Secure token-based password reset (1-hour expiry)
  - User password change from profile
  - Admin password change for users

### 🔗 URL Shortening
- **Smart URL Shortening**
  - Auto-generation with collision detection
  - Custom short codes (4+ characters, alphanumeric + hyphens/underscores)
  - Real-time duplicate URL detection (case-insensitive)
  - Real-time duplicate code validation
  - Edit mode with intelligent validation
  - Maximum shortcuts per user (configurable via MAX_SHORTCUT)
- **Analytics & Tracking**
  - Click counting per shortcut
  - Last accessed timestamp
  - Creation date tracking
  - Total clicks across all shortcuts

### 👥 User Management
- **User Dashboard**
  - View all personal shortcuts
  - Create, edit, and delete shortcuts
  - Copy short links to clipboard
  - Track clicks and creation dates
  - Responsive card-based layout
  - Dark/light theme toggle with persistence
- **Profile Features**
  - Change password securely
  - View account information
  - Manage personal settings

### 👨‍💼 Admin Panel
- **Dashboard & Analytics**
  - Total users, shortcuts, and clicks statistics
  - Top 10 performing shortcuts with bar charts (Recharts)
  - Visual analytics and insights
  - Real-time data updates
- **User Management**
  - View all users with search and sorting
  - Edit username, email, and role
  - Toggle admin/user roles
  - Verify/unverify users
  - Change user passwords administratively
  - Delete users (with cascade deletion of shortcuts)
  - View user shortcuts in modal
- **Shortcut Management**
  - View all shortcuts across users
  - Search by code or URL
  - Sort by clicks, code, or owner
  - Delete any shortcut
  - View owner information
  - Add/edit shortcuts for specific users
- **Site Settings**
  - Configure site title and branding
  - Set site icon (favicon) and logo
  - Update SEO metadata (description, keywords)
  - Changes apply immediately site-wide
- **Mobile Responsive**
  - Fully responsive admin panel (370px+)
  - Card view for mobile devices
  - Table view for desktop
  - Touch-friendly controls

### 📧 Communication
- **Contact Form**
  - Email support via SMTP (Nodemailer)
  - Rate limited to prevent spam
  - reCAPTCHA protection
  - Configurable recipient email
- **Email Features**
  - Password reset emails with secure links
  - Contact form submissions
  - HTML email templates

### 🎨 User Experience
- **Responsive Design**
  - Mobile-first approach
  - Optimized for screens 370px and up
  - Tablet and desktop layouts
  - Touch-friendly controls
- **Theme Support**
  - Dark mode
  - Light mode
  - Persistent theme preference
  - Smooth transitions
- **User Feedback**
  - Real-time validation indicators
  - Success/error notifications
  - Loading states
  - Confirmation dialogs
- **Footer Pages**
  - Privacy Policy
  - Terms of Service
  - About Us page
  - Contact information

### 🛡️ Rate Limiting
- **Public Endpoints**
  - `/api/health`: 30 requests per 5 minutes
  - `/api/status`: 100 requests per 15 minutes
  - `/api/settings`: 100 requests per 15 minutes
  - `/api/contact`: 10 requests per 15 minutes
- **Authentication**
  - Login/Register: 5 failed attempts per 15 minutes
  - Password Reset: 5 requests per 15 minutes
  - Smart counting (successful logins don't count)

### 🔍 API Documentation
- **Interactive API Docs**
  - Available at http://localhost:5000 (root)
  - Health check endpoint with system info
  - Status endpoint with API version
  - Complete endpoint documentation
  - Real-time API status indicator
  - Test health check button

## 💻 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** + **TypeScript** | Runtime and type safety |
| **Express.js** | Web framework |
| **MongoDB** + **Mongoose** | Database and ODM |
| **Passport.js** | Authentication middleware |
| **Google OAuth 2.0** | Social login |
| **JWT** | Token-based authentication |
| **bcryptjs** | Password hashing |
| **express-validator** | Input validation |
| **express-rate-limit** | DDoS protection |
| **Helmet** | Security headers |
| **nodemailer** | Email sending |
| **cookie-parser** | Cookie handling |
| **cors** | Cross-origin resource sharing |
| **crypto** | Secure token generation |
| **hpp** | HTTP parameter pollution prevention |
| **compression** | Response compression |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** + **TypeScript** | UI library and type safety |
| **Vite** | Build tool and dev server |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client with interceptors |
| **Tailwind CSS** | Utility-first styling |
| **Lucide React** | Icon library |
| **Recharts** | Data visualization |
| **Context API** | State management (Auth, Theme, Settings) |
| **Google reCAPTCHA** | Bot protection |

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn package manager
- SMTP credentials (for emails)
- Google OAuth 2.0 credentials (optional)
- Google reCAPTCHA v2 keys (optional)

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/eaeoz/shortcuts-app.git
cd shortcuts-app
```

2. **Install dependencies**
```bash
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

3. **Configure environment variables**

⚠️ **SECURITY NOTE**: Never commit `.env` files. Use `.env.example` as template.

```bash
# Backend .env
cp .env.example .env

# Frontend .env
cp client/.env.example client/.env
```

Edit both `.env` files with your actual credentials (see [Environment Variables](#environment-variables) section).

4. **Start development servers**

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000 (root)

## ⚙️ Environment Variables

### Backend (.env)
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB_NAME=shortcuts

# Security
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
SESSION_SECRET=your-session-secret-key-min-32-characters

# Server
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Application
MAX_SHORTCUT=10        # Maximum shortcuts per user
USER_TIMEOUT=1440      # Session timeout in minutes (24 hours)

# Email (SMTP)
SMTP_HOST=smtp.yandex.com
SMTP_PORT=587
SMTP_USER=your-email@yandex.com
SMTP_PASS=your-app-password
RECIPIENT_EMAIL=admin@example.com

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# reCAPTCHA (Optional)
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
```

### Frontend (client/.env)
```env
VITE_API_URL=http://localhost:5000
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

### Email Providers

**Yandex Mail** (Recommended):
```env
SMTP_HOST=smtp.yandex.com
SMTP_PORT=587
```

**Gmail**:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
# Note: Use App Password, not account password
```

**Outlook/Hotmail**:
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

## 📖 Usage

### For Users

1. **Register/Login**
   - Traditional: Email, username, password (with reCAPTCHA)
   - Google OAuth: One-click sign-in
   - Forgot password: Email-based recovery

2. **Create Shortcuts**
   - Click "New Shortcut"
   - Enter URL (http:// or https://)
   - Choose: Auto-generate or Custom code
   - System validates duplicates in real-time
   - Copy and share your short link

3. **Manage Shortcuts**
   - View all shortcuts on dashboard
   - Edit URL or short code
   - Delete unwanted shortcuts
   - Track clicks and dates
   - Copy links to clipboard

4. **Access Short URLs**
   - Format: `http://localhost:5000/s/YOUR_CODE`
   - Automatic redirect to original URL
   - Click counting and analytics

### For Admins

1. **Access Admin Panel**
   - Login with admin account
   - Click "Admin" in navigation
   - View dashboard statistics

2. **Manage Users**
   - Search and sort users
   - Edit user details
   - Change roles and passwords
   - Delete users
   - View user shortcuts

3. **Manage URLs**
   - View all shortcuts
   - Search and filter
   - Delete shortcuts
   - View analytics

4. **Configure Settings**
   - Update site branding
   - Set SEO metadata
   - Apply changes instantly

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/google/callback` - OAuth callback

### Password Management
- `POST /api/password-reset/request` - Request reset
- `POST /api/password-reset/reset` - Reset password
- `POST /api/password-reset/validate-token` - Validate token
- `PUT /api/user/change-password` - Change password

### Shortcuts (Protected)
- `GET /api/shortcuts` - Get user shortcuts
- `POST /api/shortcuts` - Create shortcut
- `PUT /api/shortcuts/:id` - Update shortcut
- `DELETE /api/shortcuts/:id` - Delete shortcut

### Admin (Admin Only)
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - All users
- `PUT /api/admin/users/:id` - Update user
- `PUT /api/admin/users/:id/role` - Update role
- `PUT /api/admin/users/:id/verify` - Toggle verification
- `PUT /api/admin/users/:id/change-password` - Change password
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/users/:userId/shortcuts` - User shortcuts
- `POST /api/admin/users/:userId/shortcuts` - Create for user
- `PUT /api/admin/users/:userId/shortcuts/:id` - Update user shortcut
- `DELETE /api/admin/users/:userId/shortcuts/:id` - Delete user shortcut
- `GET /api/admin/shortcuts` - All shortcuts
- `DELETE /api/admin/shortcuts/:id` - Delete shortcut
- `GET /api/admin/settings` - Get settings
- `PUT /api/admin/settings` - Update settings

### Public
- `GET /s/:shortCode` - Redirect to URL
- `GET /api/settings` - Public settings
- `GET /api/health` - Health check
- `GET /api/status` - API status
- `POST /api/contact` - Contact form

## 📁 Project Structure

```
shortcuts-app/
├── src/                          # Backend source code
│   ├── config/
│   │   ├── database.ts          # MongoDB connection
│   │   └── passport.ts          # Passport & OAuth config
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication
│   │   └── recaptcha.ts         # reCAPTCHA verification
│   ├── models/
│   │   ├── User.ts              # User schema
│   │   ├── Shortcut.ts          # Shortcut schema
│   │   └── Settings.ts          # Settings schema
│   ├── routes/
│   │   ├── auth.ts              # Authentication routes
│   │   ├── password-reset.ts    # Password reset
│   │   ├── user.ts              # User management
│   │   ├── shortcuts.ts         # Shortcut CRUD
│   │   ├── admin.ts             # Admin operations
│   │   ├── contact.ts           # Contact form
│   │   └── api-docs.ts          # API documentation
│   └── server.ts                # Express server
├── client/                       # Frontend React app
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ChangePasswordModal.tsx
│   │   │   └── AdminChangePasswordModal.tsx
│   │   ├── context/             # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ThemeContext.tsx
│   │   │   └── SettingsContext.tsx
│   │   ├── lib/
│   │   │   └── axios.ts         # Axios instance
│   │   ├── pages/               # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.tsx
│   │   │       ├── AdminManage.tsx
│   │   │       └── AdminSettings.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── public/                  # Static files
├── public/
│   └── api-docs.html           # API documentation page
├── .env                         # Backend environment (NOT in git)
├── .env.example                # Backend env template
├── client/.env                 # Frontend environment (NOT in git)
├── client/.env.example         # Frontend env template
└── Documentation files (*.md)
```

## 🛡️ Security Features

### Authentication
- ✅ bcrypt password hashing (10 rounds)
- ✅ JWT with HTTP-only cookies
- ✅ Google OAuth 2.0
- ✅ Session management
- ✅ Role-based access control

### Protection
- ✅ Rate limiting (all endpoints)
- ✅ reCAPTCHA v2 bot protection
- ✅ MongoDB injection prevention
- ✅ XSS protection
- ✅ CSRF protection
- ✅ HTTP parameter pollution prevention
- ✅ Security headers (Helmet)
- ✅ CORS whitelist

### Data Security
- ✅ Input validation (express-validator)
- ✅ Schema validation (Mongoose)
- ✅ Secure token generation
- ✅ Password reset with expiry
- ✅ Email verification

See [SECURITY.md](SECURITY.md) for detailed security documentation.

## 🚀 Deployment

### Production Checklist
- [ ] Update all environment variables
- [ ] Change JWT_SECRET and SESSION_SECRET
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS (secure cookies)
- [ ] Update CORS origins
- [ ] Update Google OAuth URLs
- [ ] Update reCAPTCHA domains
- [ ] Configure MongoDB IP whitelist
- [ ] Set up monitoring
- [ ] Enable database backups

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete deployment instructions.

### Build Commands
```bash
# Backend
npm run build

# Frontend
cd client && npm run build
```

## 🔧 Development

### Available Scripts

**Backend:**
```bash
npm run dev      # Development with nodemon
npm run build    # Build TypeScript
npm start        # Production server
```

**Frontend:**
```bash
npm run dev      # Vite dev server
npm run build    # Production build
npm run preview  # Preview build
```

### Testing
- Manual testing via API documentation page
- Frontend testing in browser
- Check console logs for errors
- Test mobile responsive design

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Verify MongoDB URI
- Check IP whitelist in Atlas
- Ensure database user has permissions

**CORS Error**
- Verify CLIENT_URL in backend .env
- Check VITE_API_URL in frontend .env
- Ensure both servers are running

**Email Not Sending**
- Verify SMTP credentials
- Check spam folder
- Enable "Less secure apps" (Gmail)
- Use app-specific password

**OAuth Not Working**
- Verify Google credentials
- Check authorized redirect URIs
- Clear browser cookies
- Ensure OAuth consent screen is configured

**reCAPTCHA Issues**
- Verify site and secret keys match
- Check domain whitelist
- Enable localhost in development
- Check browser console

See full troubleshooting guide in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

## 📈 Performance

- Response compression enabled
- Rate limiting prevents abuse
- MongoDB indexing on frequently queried fields
- Optimized image loading
- Lazy loading for components
- Efficient re-rendering with React

## 🔄 Updates & Maintenance

### Regular Tasks
- Update dependencies monthly
- Rotate credentials quarterly
- Review security logs
- Backup database regularly
- Monitor API usage
- Test authentication flows

See [SECURITY_ROTATION_GUIDE.md](SECURITY_ROTATION_GUIDE.md) for credential rotation procedures.

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

### Development Guidelines
- Use TypeScript with proper types
- Follow existing code style
- Add comments for complex logic
- Test on desktop and mobile
- Update documentation
- Check for console errors

## 📄 License

ISC

## 👨‍💻 Author

Shortcuts Team

## 📞 Support

- **Email**: sedatergoz@gmail.com
- **GitHub Issues**: [Report bugs](https://github.com/eaeoz/shortcuts-app/issues)
- **Contact Form**: Available in application

## 🔐 Security

For security vulnerabilities, email: sedatergoz@gmail.com

**DO NOT** open public issues for security concerns.

## 📝 Changelog

### Version 2.1.0 (Latest)
- ✨ Added API health check and status endpoints
- 🔧 Fixed Content Security Policy for inline handlers
- 📚 Updated comprehensive documentation
- 🔗 Added interactive API documentation page
- 📊 Added system information in health checks

### Version 2.0.0
- ✨ Google OAuth 2.0 authentication
- 🤖 reCAPTCHA v2 bot protection
- 🔑 Forgot password functionality
- 🔒 Password change features
- 🔄 Duplicate validation
- 📱 Mobile responsive admin panel
- 👥 User shortcuts management
- ✏️ Admin user editing
- 🚀 Enhanced error handling

### Version 1.0.0
- Initial release with core features
- JWT authentication
- URL shortening
- Admin dashboard
- Contact form
- Dark/light theme
- Rate limiting
- Responsive design

## 🙏 Acknowledgments

- React 18 and Node.js communities
- Passport.js for authentication
- Tailwind CSS for styling
- Lucide React for icons
- Recharts for data visualization
- Google for OAuth and reCAPTCHA
- MongoDB Atlas for database hosting

## 📚 Additional Resources

- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MongoDB Security](https://docs.mongodb.com/manual/administration/security-checklist/)
- [React Best Practices](https://react.dev/learn)

---

**Last Updated**: December 2, 2025  
**Status**: ✅ Production Ready  
**Version**: 2.1.0
