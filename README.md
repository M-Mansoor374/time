# Ahrefs Script (ahrf) - Full Stack Application

A complete full-stack application for managing Ahrefs tool usage with role-based access control (Super Admin, Reseller, User).

## Features

- 🔐 JWT Authentication with role-based access
- 👥 User Management (Create, Read, Update, Delete)
- 📊 Keyword Usage Tracking
- 🌐 IP Whitelist Management
- 🎨 Modern, Mobile-Responsive UI
- 📱 Mobile-First Design

## Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Process Manager**: PM2
- **Authentication**: JWT (JSON Web Tokens)

## Quick Start (Development)

1. **Clone the repository**
   ```bash
   git clone https://github.com/M-Mansoor374/time.git
   cd time
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB connection string and JWT secret
   ```

4. **Create admin user** (First time only)
   ```bash
   node create-admin.js
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open `http://localhost:5000` in your browser

## Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete VPS deployment instructions using PuTTY.

### Quick Deployment Steps

1. Connect to your VPS via SSH/PuTTY
2. Clone the repository
3. Run the deployment script:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```
4. Configure your `.env` file with production values
5. Application will be running on port 5000 (or your configured port)

## Project Structure

```
ahrf/
├── src/
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server entry point
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── models/            # Mongoose models
│   │   ├── User.js
│   │   ├── Branding.js
│   │   ├── Cookie.js
│   │   └── IpSettings.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── tool.js
│   │   ├── settings.js
│   │   └── ipSettings.js
│   └── middleware/        # Custom middleware
│       ├── auth.js
│       ├── role.js
│       ├── tool.js
│       └── ipCheck.js
├── js/                    # Frontend JavaScript
│   ├── config.js         # API configuration
│   ├── auth.js
│   ├── super-admin.js
│   ├── reseller.js
│   └── user-dashboard.js
├── css/
│   └── style.css         # Global styles
├── *.html                # Frontend pages
├── ecosystem.config.cjs  # PM2 configuration
├── package.json
└── .env.example          # Environment variables template
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users (Protected)
- `POST /api/users` - Create user (Super Admin, Reseller)
- `GET /api/users` - List users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Super Admin only)

### Tool Usage (User only)
- `POST /api/tool/use` - Increment keyword usage
- `GET /api/tool/usage` - Get usage statistics

### Settings (Super Admin)
- `GET/POST /api/admin/cookies` - Cookie management
- `GET/POST /api/admin/branding` - Branding text
- `GET/PUT /api/superadmin/settings` - IP whitelist settings

## Environment Variables

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=production
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run pm2:start` - Start with PM2
- `npm run pm2:restart` - Restart PM2 process
- `npm run pm2:logs` - View PM2 logs

## Roles

- **SUPER_ADMIN**: Full access, can create resellers and users, manage IP whitelist
- **RESELLER**: Can create and manage users only
- **USER**: Can use the tool, view own usage statistics

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- IP whitelist protection (Super Admin routes)
- Role-based access control
- CORS enabled

## License

MIT

## Support

For deployment issues, refer to [DEPLOYMENT.md](DEPLOYMENT.md) or check the logs:
- PM2 logs: `pm2 logs ahrf-backend`
- Application logs in `logs/` directory

