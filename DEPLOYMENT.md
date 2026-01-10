# VPS Deployment Guide for Ahrefs Script (ahrf)

## Prerequisites
- VPS with Ubuntu 20.04+ or similar Linux distribution
- PuTTY (Windows) or SSH client
- Domain name (optional but recommended)
- MongoDB Atlas account with connection string

## Step 1: Connect to VPS via PuTTY

1. Open PuTTY
2. Enter your VPS IP address in Host Name
3. Port: 22
4. Connection Type: SSH
5. Click "Open"
6. Login with your username and password

## Step 2: Initial Server Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 globally (process manager)
sudo npm install -g pm2

# Install Nginx (optional, for reverse proxy)
sudo apt install -y nginx

# Install Git (if not already installed)
sudo apt install -y git
```

## Step 3: Clone Repository

```bash
# Navigate to web directory
cd /var/www
# OR create your project directory
sudo mkdir -p /var/www/ahrf
cd /var/www/ahrf

# Clone your repository
sudo git clone https://github.com/M-Mansoor374/time.git .

# OR if you already have files, pull latest
git pull origin main
```

## Step 4: Install Dependencies

```bash
# Install Node.js dependencies
npm install
```

## Step 5: Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env file with your actual values
nano .env
```

Update these values in `.env`:
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_strong_random_secret_key
PORT=5000
NODE_ENV=production
```

Save and exit (Ctrl+X, then Y, then Enter)

## Step 6: Create Required Directories

```bash
# Create logs directory for PM2
mkdir -p logs
```

## Step 7: Start Application with PM2

```bash
# Start the application
pm2 start ecosystem.config.cjs

# Save PM2 configuration (auto-start on reboot)
pm2 save
pm2 startup

# Check status
pm2 status

# View logs
pm2 logs ahrf-backend
```

## Step 8: Configure Firewall (UFW)

```bash
# Allow SSH (important - do this first!)
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS (if using SSL)
sudo ufw allow 443/tcp

# Allow application port (5000)
sudo ufw allow 5000/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Step 9: Setup Nginx Reverse Proxy (Recommended)

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/ahrf
```

Add this configuration (replace `your-domain.com` with your actual domain or IP):

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Increase body size limit if needed
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/ahrf /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 10: Setup SSL with Let's Encrypt (Optional but Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Certbot will automatically configure Nginx and renew certificates
```

## Step 11: Verify Deployment

1. Access your application:
   - Direct: `http://your-vps-ip:5000`
   - Via Nginx: `http://your-domain.com` or `http://your-vps-ip`

2. Check health endpoint:
   ```bash
   curl http://localhost:5000/health
   ```

3. Check PM2 status:
   ```bash
   pm2 status
   pm2 logs ahrf-backend --lines 50
   ```

## Step 12: Update MongoDB Connection (If Needed)

If your MongoDB Atlas IP whitelist is blocking VPS IP:
1. Go to MongoDB Atlas Dashboard
2. Network Access → Add IP Address
3. Add your VPS IP address
4. Or use `0.0.0.0/0` for testing (not recommended for production)

## Useful Commands

### PM2 Commands
```bash
# View status
pm2 status

# View logs
pm2 logs ahrf-backend

# Restart application
pm2 restart ahrf-backend

# Stop application
pm2 stop ahrf-backend

# Delete from PM2
pm2 delete ahrf-backend

# Monitor (real-time)
pm2 monit
```

### Nginx Commands
```bash
# Test configuration
sudo nginx -t

# Restart
sudo systemctl restart nginx

# Reload (without downtime)
sudo systemctl reload nginx

# Check status
sudo systemctl status nginx
```

### Update Application
```bash
# Navigate to project directory
cd /var/www/ahrf

# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install

# Restart application
pm2 restart ahrf-backend

# Check logs
pm2 logs ahrf-backend --lines 50
```

## Troubleshooting

### Application not starting
```bash
# Check logs
pm2 logs ahrf-backend --err

# Check if port is in use
sudo lsof -i :5000

# Check environment variables
cat .env
```

### Cannot connect to MongoDB
- Verify MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas
- Test connection: `mongosh "your_connection_string"`

### Nginx 502 Bad Gateway
- Check if backend is running: `pm2 status`
- Check backend logs: `pm2 logs ahrf-backend`
- Verify proxy_pass URL in Nginx config

### Permission Issues
```bash
# Fix ownership (replace 'your-user' with actual username)
sudo chown -R $USER:$USER /var/www/ahrf

# Fix permissions
chmod -R 755 /var/www/ahrf
```

## Security Checklist

- [ ] Change default SSH port (optional but recommended)
- [ ] Use strong JWT_SECRET
- [ ] Enable firewall (UFW)
- [ ] Setup SSL certificate (Let's Encrypt)
- [ ] Keep system updated: `sudo apt update && sudo apt upgrade`
- [ ] Use strong MongoDB Atlas password
- [ ] Restrict MongoDB Atlas IP whitelist
- [ ] Regular backups of database
- [ ] Monitor PM2 logs regularly

## Support

For issues, check:
- PM2 logs: `pm2 logs ahrf-backend`
- Nginx error log: `sudo tail -f /var/log/nginx/error.log`
- System logs: `sudo journalctl -xe`

