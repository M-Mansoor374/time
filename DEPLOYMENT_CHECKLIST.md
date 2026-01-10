# Vercel Deployment Checklist

## Pre-Deployment Setup

### 1. Environment Variables (Required)
Set these in Vercel Dashboard → Project Settings → Environment Variables:

- ✅ **MONGO_URI**: `mongodb+srv://project:hOATmQX1gdXJLEQl@ahrf.uqeep5o.mongodb.net/ahrf?retryWrites=true&w=majority&appName=ahrf`
- ✅ **JWT_SECRET**: A strong random string (generate with: `openssl rand -base64 32`)

### 2. MongoDB Atlas Configuration
- ✅ Whitelist Vercel IPs: Add `0.0.0.0/0` to MongoDB Atlas Network Access (for serverless)
- ✅ Verify database user has proper permissions
- ✅ Database name: `ahrf`

### 3. Vercel Project Settings
- ✅ Framework Preset: **Other**
- ✅ Root Directory: `./` (root)
- ✅ Build Command: `npm run vercel-build` (or leave empty)
- ✅ Output Directory: (leave empty - auto-detect)
- ✅ Install Command: `npm install`
- ✅ Node.js Version: `18.x` (or higher)

## Deployment Steps

1. ✅ Go to [Vercel Dashboard](https://vercel.com)
2. ✅ Click **"Add New"** → **"Project"**
3. ✅ Import from GitHub: Select repository `M-Mansoor374/time`
4. ✅ Configure environment variables (see above)
5. ✅ Click **"Deploy"**

## Post-Deployment Verification

### Test Health Endpoint
```bash
curl https://your-project.vercel.app/api/health
```
Expected: `{"status":"OK"}`

### Test Login Endpoint
```bash
curl -X POST https://your-project.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password","role":"SUPER_ADMIN"}'
```

### Verify Static Files
- ✅ `https://your-project.vercel.app/login.html` loads
- ✅ `https://your-project.vercel.app/super-admin.html` loads (after login)
- ✅ CSS and JS files load correctly

## Common Issues & Solutions

### 404 Errors
**Symptom**: All API routes return 404  
**Solution**: 
- Check `vercel.json` rewrite configuration
- Verify `api/index.js` exists and exports correctly
- Check Vercel function logs in dashboard

### Database Connection Errors
**Symptom**: 503 errors or "Database connection failed"  
**Solution**:
- Verify `MONGO_URI` environment variable is set
- Check MongoDB Atlas IP whitelist (allow all IPs: `0.0.0.0/0`)
- Verify database user credentials
- Check function logs for detailed error messages

### CORS Errors
**Symptom**: Frontend can't make API requests  
**Solution**:
- Headers are configured in `vercel.json`
- Check browser console for specific CORS errors
- Verify API base URL in frontend is correct (should be `/api` for production)

### Build Failures
**Symptom**: Deployment fails during build  
**Solution**:
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure Node.js version is compatible (18.x+)
- Check for syntax errors in code

## Monitoring

### Check Function Logs
1. Go to Vercel Dashboard
2. Select your project
3. Click **"Functions"** tab
4. Click on a function to see logs

### Check Deployment Logs
1. Go to Vercel Dashboard
2. Select your project
3. Click on a deployment
4. View build and runtime logs

## Current Configuration

- ✅ **Serverless Function**: `api/index.js`
- ✅ **Express App**: `src/app.js`
- ✅ **Database**: MongoDB Atlas
- ✅ **Authentication**: JWT
- ✅ **CORS**: Enabled for all origins
- ✅ **Function Timeout**: 30 seconds

## Notes

- The project uses Vercel's native Express support (no serverless-http needed)
- Database connections are cached across function invocations
- All static files are automatically served from root
- API routes are handled by the Express serverless function
- Environment variables are automatically injected at runtime

