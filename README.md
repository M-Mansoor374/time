# Ahrefs Script - Full Stack Application

A complete user management system with role-based access control (Super Admin, Reseller, User) and Ahrefs tool integration.

## Features

- 🔐 JWT-based authentication with role-based access control
- 👥 User management (Create, Read, Update, Delete)
- 📊 Keyword usage tracking and limits
- 🎨 Modern, responsive UI with mobile-first design
- 🌐 IP whitelisting and static IP management
- 🍪 Cookie and branding management

## Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Deployment**: Vercel

## Local Development

### Prerequisites

- Node.js 18.x or higher
- MongoDB Atlas account (or local MongoDB)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd time
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the root directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. Create initial Super Admin user:
```bash
node create-admin.js
```

5. Start the development server:
```bash
npm run dev
```

6. Open `http://localhost:5000` in your browser (or serve HTML files via a static server)

## Deployment on Vercel

### Prerequisites

- Vercel account
- GitHub repository
- MongoDB Atlas connection string

### Steps

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Deploy on Vercel:
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     - `MONGO_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Your JWT secret key
   - Deploy

3. After deployment:
   - Your API will be available at `https://your-project.vercel.app/api/*`
   - Frontend will be served from the root domain
   - Make sure to create the initial Super Admin user after first deployment

### Environment Variables on Vercel

Add these in Vercel Dashboard → Project Settings → Environment Variables:

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens

## Project Structure

```
.
├── api/
│   └── index.js              # Vercel serverless function handler
├── css/
│   └── style.css             # Global styles
├── js/
│   ├── auth.js               # Authentication utilities
│   ├── config.js             # API configuration
│   ├── super-admin.js        # Super Admin dashboard logic
│   ├── reseller.js           # Reseller dashboard logic
│   └── user-dashboard.js     # User dashboard logic
├── src/
│   ├── config/
│   │   └── db.js             # Database connection
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication
│   │   ├── role.js           # Role-based authorization
│   │   ├── ipCheck.js        # IP whitelist middleware
│   │   └── tool.js           # Tool access validation
│   ├── models/
│   │   ├── User.js           # User model
│   │   ├── Cookie.js         # Cookie model
│   │   ├── Branding.js       # Branding model
│   │   └── IpSettings.js     # IP settings model
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── users.js          # User management routes
│   │   ├── tool.js           # Tool usage routes
│   │   ├── settings.js       # Settings routes
│   │   └── ipSettings.js     # IP settings routes
│   ├── app.js                # Express app configuration
│   └── server.js             # Server entry point (local dev)
├── login.html                # Login page
├── super-admin.html          # Super Admin dashboard
├── reseller.html             # Reseller dashboard
├── user-dashboard.html       # User dashboard
├── index.html                # Root redirect
├── vercel.json               # Vercel configuration
└── package.json              # Dependencies and scripts
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### User Management
- `POST /api/users` - Create user (Super Admin, Reseller)
- `GET /api/users` - List users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Super Admin only)

### Tool Usage
- `POST /api/tool/use` - Increment keyword usage
- `GET /api/tool/usage` - Get usage statistics

### Settings
- `GET /api/admin/cookies` - Get cookies (Super Admin)
- `POST /api/admin/cookies` - Save cookies (Super Admin)
- `GET /api/branding` - Get branding text
- `POST /api/admin/branding` - Save branding (Super Admin)

### IP Settings
- `GET /api/superadmin/settings` - Get IP settings
- `PUT /api/superadmin/settings` - Update IP settings

## Roles

- **SUPER_ADMIN**: Full system access, can create resellers and users, manage IP settings, cookies, and branding
- **RESELLER**: Can create and manage users, view own users
- **USER**: Can use the Ahrefs tool, view own usage statistics

## License

MIT

