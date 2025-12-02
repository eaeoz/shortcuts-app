# Shortcuts - URL Shortener Application

A modern, full-stack URL shortener application with user authentication, admin dashboard, contact form, and comprehensive security features.

## Features

### User Features
- 🔐 **User Authentication** - Secure login and registration with JWT
- 🔗 **URL Shortening** - Create custom or auto-generated short URLs
- ✏️ **URL Management** - Edit, delete, and track your shortcuts
- 📊 **Click Analytics** - Track clicks on your shortened URLs
- 🎨 **Custom Short Codes** - Choose your own memorable short codes (min 4 characters)
- 🌓 **Dark/Light Theme** - Toggle between dark and light modes with persistent preference
- 📱 **Responsive Design** - Works seamlessly on all devices
- ⚡ **Real-time Updates** - Instant feedback on all actions
- 📧 **Contact Form** - Get in touch with support via email
- 📄 **Footer Pages** - Privacy Policy, Terms of Service, About Us

### Admin Features
- 👥 **User Management** - View, manage, and change user roles
- 🔗 **URL Management** - Monitor and manage all shortcuts
- 📈 **Dashboard Statistics** - View total users, shortcuts, and clicks
- 📊 **Analytics Charts** - Visual representation of top shortcuts with Recharts
- ⚙️ **Site Settings** - Configure site title, icon, logo, and SEO metadata
- 🎨 **Branding Control** - Customize site appearance and identity

### Security Features
- 🛡️ **Rate Limiting** - Protection against brute force attacks
  - Login/Register: 5 failed attempts per 15 minutes (smart counting)
  - Contact Form: 5 submissions per 15 minutes
- 🔒 **Password Hashing** - bcryptjs with salt (10 rounds)
- 🎫 **JWT Authentication** - Secure token-based auth with expiration
- 🍪 **HTTP-Only Cookies** - Protection against XSS attacks
- ✅ **Input Validation** - Comprehensive validation with express-validator
- 🔐 **Role-Based Access Control** - User and admin roles
- 🌐 **CORS Configuration** - Whitelisted origins only
- 📧 **Email Validation** - Regex pattern matching for contact form

## Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** - Web framework
- **MongoDB** with **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **express-rate-limit** - DDoS and brute force protection
- **nodemailer** - Email sending for contact form
- **cookie-parser** - Cookie handling
- **cors** - Cross-origin resource sharing

### Frontend
- **React 18** with **TypeScript**
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon library
- **Recharts** - Data visualization and charts
- **Context API** - State management (Auth, Theme, Settings)

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn package manager
- SMTP credentials (for contact form email sending)

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

Backend `.env` file (root directory):
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

# Email Configuration (for contact form)
SMTP_HOST=smtp.yandex.com
SMTP_PORT=587
SMTP_USER=your-email@yandex.com
SMTP_PASS=your-app-password
RECIPIENT_EMAIL=your-email@gmail.com
```

Frontend `client/.env` file:
```env
VITE_API_URL=http://localhost:5000
VITE_MAX_SHORTCUT=10
```

5. **Start the development servers**

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
   - Register a new account with username, email, and password (min 6 characters)
   - Or login with existing credentials
   - Theme preference is saved and persists across sessions

2. **Create Shortcuts**
   - Click "New Shortcut" button on dashboard
   - Enter the original URL (with http:// or https://)
   - Choose generation method:
     - **Auto-generate**: System creates random short code
     - **Custom**: Enter your own code (min 4 characters, alphanumeric + hyphens/underscores)
   - Click "Create Shortcut"
   - Maximum 10 shortcuts per user (configurable)

3. **Manage Shortcuts**
   - View all your shortcuts on the dashboard with click counts
   - Copy short links to clipboard with one click
   - Edit shortcut details (URL and custom code)
   - Delete shortcuts you no longer need
   - Track clicks and last accessed time

4. **Access Shortened URLs**
   - Use the format: `http://localhost:5000/s/YOUR_SHORT_CODE`
   - Automatically redirects to the original URL
   - Click count increments with each visit
   - Last accessed timestamp updates

5. **Contact Support**
   - Navigate to the Contact page from footer
   - Fill out the form with your name, email, subject, and message
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

3. **Admin Dashboard**
   - View comprehensive statistics:
     - Total users registered
     - Total shortcuts created
     - Total clicks across all shortcuts
   - See top 10 performing shortcuts
   - Visual analytics with bar charts
   - Real-time data updates

4. **Manage Users**
   - View all registered users with details
   - See user roles, registration date, last login
   - Toggle user roles between "user" and "admin"
   - Delete user accounts (with confirmation)
   - Search and filter users

5. **Manage URLs**
   - View all shortcuts across all users
   - See shortcut owner, creation date, clicks
   - Delete any shortcut (with confirmation)
   - Monitor system-wide URL usage

6. **Site Settings**
   - Update site title (appears in browser tab)
   - Configure site icon URL (favicon)
   - Set site logo URL (in header)
   - Update SEO description (meta description)
   - Set SEO keywords (meta keywords)
   - Changes apply immediately across the site

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (rate limited)
- `POST /api/auth/login` - Login user (rate limited)
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Shortcuts (Protected)
- `GET /api/shortcuts` - Get user's shortcuts
- `POST /api/shortcuts` - Create new shortcut
- `PUT /api/shortcuts/:id` - Update shortcut
- `DELETE /api/shortcuts/:id` - Delete shortcut

### Admin (Admin Only)
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/shortcuts` - Get all shortcuts
- `DELETE /api/admin/shortcuts/:id` - Delete shortcut
- `GET /api/admin/settings` - Get site settings
- `PUT /api/admin/settings` - Update site settings

### Public Endpoints
- `GET /s/:shortCode` - Redirect to original URL (increments clicks)
- `GET /api/settings` - Get site settings (for branding)
- `POST /api/contact` - Send contact form email (rate limited)

## Project Structure

```
shortcuts-app/
├── src/                      # Backend source code
│   ├── config/              # Configuration files
│   │   └── database.ts      # MongoDB connection setup
│   ├── middleware/          # Express middleware
│   │   └── auth.ts          # JWT authentication middleware
│   ├── models/              # Mongoose models
│   │   ├── User.ts          # User schema with roles
│   │   ├── Shortcut.ts      # Shortcut schema with analytics
│   │   └── Settings.ts      # Site settings schema
│   ├── routes/              # API route handlers
│   │   ├── auth.ts          # Authentication routes (with rate limiting)
│   │   ├── shortcuts.ts     # Shortcut CRUD operations
│   │   ├── admin.ts         # Admin panel operations
│   │   └── contact.ts       # Contact form email handler
│   └── server.ts            # Express server & middleware setup
├── client/                  # Frontend React app
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Navbar.tsx   # Navigation with theme toggle
│   │   │   └── Footer.tsx   # Footer with page links
│   │   ├── context/         # React context providers
│   │   │   ├── AuthContext.tsx      # Authentication state
│   │   │   ├── ThemeContext.tsx     # Dark/light theme
│   │   │   └── SettingsContext.tsx  # Site settings
│   │   ├── lib/             # Utility functions
│   │   │   └── axios.ts     # Axios instance with interceptors
│   │   ├── pages/           # Page components
│   │   │   ├── Login.tsx           # Login page with theme toggle
│   │   │   ├── Register.tsx        # Registration page
│   │   │   ├── Dashboard.tsx       # User dashboard
│   │   │   ├── Contact.tsx         # Contact form
│   │   │   ├── About.tsx           # About us page
│   │   │   ├── PrivacyPolicy.tsx   # Privacy policy
│   │   │   ├── Terms.tsx           # Terms of service
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.tsx  # Admin stats & analytics
│   │   │       ├── AdminManage.tsx     # User & URL management
│   │   │       └── AdminSettings.tsx   # Site settings editor
│   │   ├── App.tsx          # Main app with routing
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles & Tailwind
│   ├── .env                 # Frontend environment variables
│   └── package.json
├── .env                     # Backend environment variables
├── tsconfig.json           # TypeScript configuration
└── package.json            # Backend dependencies
```

## Security Features Details

### Rate Limiting
**Authentication Endpoints** (`/api/auth/login`, `/api/auth/register`):
- 5 failed attempts per IP per 15 minutes
- Smart counting: successful logins don't count toward limit
- Automatic reset after time window
- Protects against brute force password attacks

**Contact Form** (`/api/contact`):
- 5 submissions per IP per 15 minutes
- Prevents spam and abuse
- Clean error messages for users

### Password Security
- Passwords hashed using bcryptjs with salt rounds
- Minimum 6 character requirement
- Never stored in plain text
- Secure comparison using bcrypt.compare()

### JWT Tokens
- Signed with secret key from environment
- Configurable expiration time (default: 24 hours)
- Stored in HTTP-only cookies
- Validated on each protected request

### Input Validation
- Email format validation with regex
- Username length validation (min 3 characters)
- URL format validation for shortcuts
- Short code pattern validation (alphanumeric + hyphens/underscores)
- Sanitization of user inputs

## Email Configuration

The contact form uses Nodemailer with SMTP. Example configuration for common providers:

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

**Frontend Issues:**
- Check browser console for errors
- Verify API URL in `client/.env`
- Check network tab for API calls
- Clear browser cache and localStorage

**Email Issues:**
- Verify SMTP credentials
- Check spam folder for test emails
- Test with simple SMTP testing tools
- Enable "Allow less secure apps" for Gmail

## Production Deployment

### 1. Environment Setup
```env
NODE_ENV=production
JWT_SECRET=generate-strong-secret-key-here
MONGODB_URI=your-production-mongodb-uri
CLIENT_URL=https://your-domain.com
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
- Railway: Git-based deployment
- Heroku: Easy deployment with Heroku CLI
- DigitalOcean: VPS with PM2
- AWS EC2: Full control with Docker

**Frontend:**
- Vercel: Automatic deployments from Git
- Netlify: CI/CD with GitHub integration
- Cloudflare Pages: Fast CDN distribution
- Traditional hosting: Build and upload dist/ folder

### 4. Production Checklist
- ✅ Strong JWT secret generated
- ✅ MongoDB production database configured
- ✅ CORS origins set to production domain
- ✅ SMTP credentials for production email
- ✅ Environment variables set on hosting platform
- ✅ HTTPS enabled (SSL certificate)
- ✅ Rate limiting configured appropriately
- ✅ Error logging and monitoring setup
- ✅ Database backups configured
- ✅ CDN for static assets (optional)

## Troubleshooting

### Common Issues

**"Cannot connect to MongoDB"**
- Check MongoDB URI is correct
- Verify IP whitelist in MongoDB Atlas
- Ensure database user has proper permissions

**"CORS error"**
- Verify CLIENT_URL in backend .env
- Check frontend is running on correct port
- Ensure both origins are allowed in CORS config

**"Rate limit exceeded"**
- Wait 15 minutes for limit to reset
- Check if you're using correct credentials
- Verify IP address isn't blocked

**"Email not sending"**
- Verify SMTP credentials
- Check SMTP server allows connections
- Enable "Less secure apps" for Gmail
- Use app-specific password

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

ISC

## Author

Shortcuts Team

## Support

For issues and questions, please:
- Open an issue on GitHub
- Use the contact form in the application
- Email: sedatergoz@gmail.com

## Acknowledgments

- Built with modern React and Node.js
- UI inspired by modern design principles
- Icons by Lucide React
- Charts by Recharts
- Styling with Tailwind CSS
