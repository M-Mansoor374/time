# Vercel Deployment Guide

## ✅ Project Status: Ready for Vercel Deployment

All changes have been pushed to GitHub. The project is now configured for Vercel deployment using Vercel's native Express support with ES modules.

## Configuration Summary

### Files Updated:
- ✅ `vercel.json` - Vercel configuration (removed conflicting `builds`, using modern approach)
- ✅ `api/index.js` - Serverless function handler for Express app
- ✅ `src/app.js` - Added catch-all 404 route
- ✅ `js/config.js` - Dynamic API base URL (works with localhost and Vercel)
- ✅ `package.json` - Added Vercel build script

### Environment Variables Required on Vercel:

1. **MONGO_URI**: Your MongoDB Atlas connection string
   ```
   mongodb+srv://project:hOATmQX1gdXJLEQl@ahrf.uqeep5o.mongodb.net/ahrf?retryWrites=true&w=majority&appName=ahrf
   ```

2. **JWT_SECRET**: Your JWT secret key (use a strong random string)

## Deployment Steps on Vercel:

1. **Go to Vercel Dashboard**: https://vercel.com
2. **Click "New Project"**
3. **Import from GitHub**: Select your repository `M-Mansoor374/time`
4. **Configure Project**:
   - Framework Preset: Other
   - Root Directory: `./`
   - Build Command: `npm run vercel-build` (or leave empty)
   - Output Directory: (leave empty - Vercel will auto-detect)
5. **Add Environment Variables**:
   - `MONGO_URI` = `your_mongodb_connection_string`
   - `JWT_SECRET` = `your_jwt_secret_key`
6. **Click "Deploy"**

## Post-Deployment:

1. After deployment, test the health endpoint:
   ```
   https://your-project.vercel.app/api/health
   ```

2. Create initial Super Admin user by running the `create-admin.js` script locally or via MongoDB Atlas console.

3. Test login at:
   ```
   https://your-project.vercel.app/login.html
   ```

## API Routes (after deployment):

- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/tool/use` - Use tool
- `GET /api/tool/usage` - Get usage stats
- `GET /api/branding` - Get branding text
- `POST /api/admin/branding` - Save branding (Super Admin)
- `GET /api/superadmin/settings` - Get IP settings
- `PUT /api/superadmin/settings` - Update IP settings

## Troubleshooting:

### 404 Errors:
- Ensure environment variables are set correctly
- Check Vercel function logs in the dashboard
- Verify MongoDB connection string is correct
- Make sure all dependencies are in `package.json`

### Database Connection Issues:
- Verify `MONGO_URI` environment variable is set
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for Vercel)
- Ensure database user has proper permissions

### CORS Issues:
- Headers are already configured in `vercel.json`
- If issues persist, check the `cors` middleware in `src/app.js`

## Notes:

- The project uses Vercel's serverless functions for the backend
- Static files (HTML, CSS, JS, images) are served automatically
- API routes are handled by `/api/index.js` serverless function
- Database connections are cached across function invocations for performance

