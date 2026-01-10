# Troubleshooting "Failed to connect to server" Error

## Quick Checks

### 1. Verify Environment Variables in Vercel

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**

**Required Variables:**
- ✅ `MONGO_URI` = `mongodb+srv://project:hOATmQX1gdXJLEQl@ahrf.uqeep5o.mongodb.net/ahrf?retryWrites=true&w=majority&appName=ahrf`
- ✅ `JWT_SECRET` = `your_secret_key_here` (any strong random string)

**After adding/changing environment variables:**
- **Redeploy** your project (or wait for auto-deploy if connected to GitHub)

### 2. Test Health Endpoint

Test if the API is accessible:
```bash
curl https://time-mgai.vercel.app/api/health
```

Expected response:
```json
{"status":"OK","timestamp":"2024-..."}
```

If this works, the API is deployed correctly.

### 3. Test Login Endpoint

```bash
curl -X POST https://time-mgai.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email","password":"your-password","role":"SUPER_ADMIN"}'
```

### 4. Check MongoDB Atlas Configuration

**Network Access:**
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Add `0.0.0.0/0` (allow from anywhere) OR add Vercel's IP ranges
4. Save changes

**Database User:**
- Verify the database user has read/write permissions
- Check username and password match the connection string

### 5. Check Vercel Function Logs

1. Go to **Vercel Dashboard → Your Project → Functions Tab**
2. Click on `/api/index`
3. View **Runtime Logs**
4. Look for errors like:
   - "MONGO_URI is not defined"
   - "MongoDB connection error"
   - Any other error messages

### 6. Common Issues & Solutions

#### Issue: "MONGO_URI is not defined"
**Solution:** Add `MONGO_URI` environment variable in Vercel settings and redeploy

#### Issue: "MongoDB connection error"
**Solutions:**
- Check MongoDB Atlas Network Access (allow `0.0.0.0/0`)
- Verify connection string is correct
- Check database user credentials
- Ensure database name `ahrf` exists

#### Issue: CORS errors in browser console
**Solution:** CORS is already configured in `vercel.json`. If issues persist:
- Check browser console for specific CORS error
- Verify API base URL in frontend is `/api` (not `http://localhost:5000/api`)

#### Issue: 404 Not Found for API routes
**Solution:**
- Verify `vercel.json` has correct rewrite configuration
- Check that `api/index.js` exists
- Ensure routes start with `/api/` prefix

#### Issue: Timeout errors
**Solution:**
- Check function timeout (should be 30 seconds max)
- Review function logs for slow database queries
- Optimize database queries if needed

### 7. Browser Console Debugging

Open browser Developer Tools (F12) → Console tab:
- Look for network errors
- Check if API calls are being made
- Verify API base URL is correct (should be `/api` in production)

### 8. Verify Deployment

Check your latest deployment:
1. Go to Vercel Dashboard → Deployments
2. Verify latest deployment shows "Ready" status
3. Check build logs for any errors
4. If build failed, fix errors and redeploy

## Step-by-Step Fix Process

1. ✅ **Add Environment Variables** in Vercel Dashboard
2. ✅ **Redeploy** the project (trigger new deployment)
3. ✅ **Test Health Endpoint**: `https://time-mgai.vercel.app/api/health`
4. ✅ **Check Function Logs** for any errors
5. ✅ **Verify MongoDB Atlas** Network Access settings
6. ✅ **Test Login** from the frontend
7. ✅ **Check Browser Console** for any client-side errors

## Still Having Issues?

1. Check Vercel Function Runtime Logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test the health endpoint to confirm API is accessible
4. Check MongoDB Atlas logs for connection attempts
5. Review the deployment build logs for any build-time errors

