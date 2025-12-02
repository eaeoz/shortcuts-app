# Shortcuts - URL Shortener Application

A modern, full-stack URL shortener application with user authentication, admin dashboard, and dark/light theme support.

## Features

### User Features
- 🔐 **User Authentication** - Secure login and registration with JWT
- 🔗 **URL Shortening** - Create custom or auto-generated short URLs
- ✏️ **URL Management** - Edit, delete, and track your shortcuts
- 📊 **Click Analytics** - Track clicks on your shortened URLs
- 🎨 **Custom Short Codes** - Choose your own memorable short codes (min 4 characters)
- 🌓 **Dark/Light Theme** - Toggle between dark and light modes
- 📱 **Responsive Design** - Works seamlessly on all devices
- ⚡ **Real-time Updates** - Instant feedback on all actions

### Admin Features
- 👥 **User Management** - View, manage, and change user roles
- 🔗 **URL Management** - Monitor and manage all shortcuts
- 📈 **Dashboard Statistics** - View total users, shortcuts, and clicks
- 📊 **Analytics Charts** - Visual representation of top shortcuts
- ⚙️ **Site Settings** - Configure site title, icon, logo, and SEO

## Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** - Web framework
- **MongoDB** with **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React 18** with **TypeScript**
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Recharts** - Data visualization

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/eaeoz/shortcuts.git
cd shortcuts
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

The `.env` file in the root directory is already configured with your MongoDB credentials. Verify these settings:

```env
# MongoDB Configuration
MONGODB_DB_NAME=shortcuts
MONGODB_URI=mongodb+srv://sedat:Sedat_mongodb_12@cluster0.aqhcv7a.mongodb.net/

# Application Settings
MAX_SHORTCUT=10
USER_TIMEOUT=1440
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

The `client/.env` file is already configured:
```env
VITE_API_URL=http://localhost:5000
VITE_MAX_SHORTCUT=10
```

5. **Start the development servers**

**Option 1: Run both servers separately (recommended for development)**

Terminal 1 - Backend:
```bash
npm run dev
```

Terminal 2 - Frontend:
```bash
npm run client
```

**Option 2: Run backend only**
```bash
npm run server
```

Then navigate to http://localhost:5173 for the frontend and http://localhost:5000 for the API.

## Usage

### User Workflow

1. **Register/Login**
   - Navigate to http://localhost:5173
   - Register a new account or login with existing credentials

2. **Create Shortcuts**
   - Click "New Shortcut" button
   - Enter the original URL
   - Optionally provide a custom short code (min 4 characters, letters, numbers, hyphens, underscores)
   - Click "Create"

3. **Manage Shortcuts**
   - View all your shortcuts on the dashboard
   - Copy short links to clipboard
   - Edit or delete shortcuts
   - Track click counts

4. **Access Shortened URLs**
   - Use the format: `http://localhost:5000/s/YOUR_SHORT_CODE`
   - Redirects to the original URL
   - Click count increments automatically

### Admin Workflow

1. **Create Admin User**
   - First, register a regular user
   - Connect to MongoDB and manually change the user's role to "admin"
   - Or use the admin panel to promote users after creating an initial admin

2. **Access Admin Panel**
   - Login with admin credentials
   - Click "Admin" in navigation bar

3. **Admin Dashboard**
   - View statistics (total users, shortcuts, clicks)
   - See top shortcuts with click analytics
   - Visualize data with charts

4. **Manage Users**
   - View all users
   - Toggle user roles (user ↔ admin)
   - Delete users

5. **Manage URLs**
   - View all shortcuts across all users
   - Delete any shortcut
   - Monitor URL performance

6. **Site Settings**
   - Update site title
   - Configure site icon and logo URLs
   - Set SEO description and keywords

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

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

### Redirect
- `GET /s/:shortCode` - Redirect to original URL

## Project Structure

```
shortcuts/
├── src/                      # Backend source code
│   ├── config/              # Configuration files
│   │   └── database.ts      # MongoDB connection
│   ├── middleware/          # Express middleware
│   │   └── auth.ts          # Authentication middleware
│   ├── models/              # Mongoose models
│   │   ├── User.ts
│   │   ├── Shortcut.ts
│   │   └── Settings.ts
│   ├── routes/              # API routes
│   │   ├── auth.ts
│   │   ├── shortcuts.ts
│   │   └── admin.ts
│   └── server.ts            # Express server
├── client/                  # Frontend React app
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── context/         # React context providers
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── lib/             # Utility functions
│   │   │   └── axios.ts
│   │   ├── pages/           # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.tsx
│   │   │       └── AdminManage.tsx
│   │   ├── App.tsx          # Main app component
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── .env                 # Frontend environment variables
│   └── package.json
├── .env                     # Backend environment variables
├── tsconfig.json           # TypeScript configuration
└── package.json            # Backend dependencies
```

## Environment Variables

### Backend (.env)
- `MONGODB_URI` - MongoDB connection string
- `MONGODB_DB_NAME` - Database name
- `JWT_SECRET` - Secret key for JWT tokens
- `MAX_SHORTCUT` - Maximum shortcuts per user
- `USER_TIMEOUT` - Session timeout in minutes
- `PORT` - Server port
- `CLIENT_URL` - Frontend URL for CORS
- `NODE_ENV` - Environment (development/production)

### Frontend (client/.env)
- `VITE_API_URL` - Backend API URL
- `VITE_MAX_SHORTCUT` - Maximum shortcuts display

## Security Features

- 🔒 Password hashing with bcryptjs
- 🎫 JWT-based authentication
- 🍪 HTTP-only cookies for tokens
- ✅ Input validation with express-validator
- 🛡️ Role-based access control (user/admin)
- 🔐 Protected routes on frontend and backend

## Development

### Available Scripts

**Backend:**
- `npm run dev` - Start backend in development mode
- `npm run server` - Start backend with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

**Frontend:**
- `npm run client` - Start frontend development server
- `cd client && npm run build` - Build frontend for production

## Production Deployment

1. **Build the application**
```bash
npm run build
```

2. **Set production environment variables**
- Update `NODE_ENV` to `production`
- Use a strong `JWT_SECRET`
- Configure production MongoDB URI
- Set production `CLIENT_URL`

3. **Deploy**
- Backend: Deploy to services like Heroku, Railway, or DigitalOcean
- Frontend: Deploy to Vercel, Netlify, or serve statically

## License

ISC

## Author

Shortcuts Team

## Support

For issues and questions, please open an issue on the GitHub repository.
