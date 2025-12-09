# Deployment Guide: HireConnect Worker Marketplace

This guide explains how to deploy HireConnect using the **cheapest path**: 
- **Frontend**: Vercel (free tier)
- **Backend**: Railway (free tier with $5 credits/month)
- **Database**: Supabase (already configured, free tier)

**Estimated Monthly Cost: $0-5** (within free tier limits)

---

## Prerequisites

1. GitHub account with this repository pushed
2. Supabase account (already set up with database)
3. Vercel account (free)
4. Railway account (free with $5 monthly credits)

---

## Step 1: Push Code to GitHub

If not already done, push your code to a GitHub repository:

```bash
git init
git add .
git commit -m "Prepare for deployment"
git remote add origin https://github.com/YOUR_USERNAME/hireconnect.git
git push -u origin main
```

---

## Step 2: Deploy Backend on Railway

### 2.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended for easy deployment)

### 2.2 Create New Project
1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Select your HireConnect repository
3. Railway will auto-detect the Node.js project

### 2.3 Configure Environment Variables
In Railway dashboard, go to your project → **Variables** tab and add:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Production mode |
| `SUPABASE_DATABASE_URL` | `postgresql://postgres.xxx:password@aws-1-xxx.pooler.supabase.com:5432/postgres` | Your Supabase connection string |
| `SESSION_SECRET` | `your-secure-32-char-secret-here` | Generate a secure random string (32+ chars) |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app` | Your Vercel frontend URL (add after Vercel deploy) |

**IMPORTANT: Do NOT set the `PORT` variable.** Railway automatically assigns and injects PORT. The app will use `process.env.PORT` which Railway provides.

### 2.4 Generate Settings
Railway will use the `railway.toml` configuration:
- Build: `npm run build`
- Start: `npm run start`
- Health check: `/health`

### 2.5 Deploy
1. Railway auto-deploys on push
2. Get your backend URL: `https://your-project.up.railway.app`
3. Test: `curl https://your-project.up.railway.app/health`

---

## Step 3: Deploy Frontend on Vercel

### 3.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

### 3.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Select your HireConnect repository
3. Vercel detects Vite framework

### 3.3 Configure Build Settings
- **Framework Preset**: Vite
- **Root Directory**: `.` (project root)
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`

### 3.4 Add Environment Variables
In **Environment Variables** section:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-project.up.railway.app` (your Railway backend URL) |

### 3.5 Deploy
1. Click **"Deploy"**
2. Vercel builds and deploys your frontend
3. Get your frontend URL: `https://your-app.vercel.app`

---

## Step 4: Update Backend CORS

After getting your Vercel URL, update Railway environment:

1. Go to Railway → Your project → **Variables**
2. Update `ALLOWED_ORIGINS` to include your Vercel URL:
   ```
   https://your-app.vercel.app
   ```
3. Railway auto-redeploys with new settings

---

## Step 5: Verify Deployment

### Test Backend
```bash
curl https://your-project.up.railway.app/health
# Should return: {"status":"ok","timestamp":...}

curl https://your-project.up.railway.app/api/jobs
# Should return job listings
```

### Test Frontend
1. Open `https://your-app.vercel.app`
2. You should see the login page
3. Try logging in with test credentials:
   - Worker: `rajesh_kumar1` / `test123`
   - Employer: `arjun_malhotra1` / `test123`

---

## Environment Variables Summary

### Railway (Backend)
| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | Set to `production` |
| `PORT` | Yes | `8080` |
| `SUPABASE_DATABASE_URL` | Yes | Supabase PostgreSQL connection |
| `SESSION_SECRET` | Yes | 32+ character secret |
| `ALLOWED_ORIGINS` | **Yes** | Vercel frontend URL (REQUIRED for security - without this, all cross-origin requests will be blocked) |
| `RAZORPAY_KEY_ID` | Optional | For payments |
| `RAZORPAY_KEY_SECRET` | Optional | For payments |

### Vercel (Frontend)
| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Railway backend URL |

---

## Troubleshooting

### 502 Bad Gateway Errors
This is the most common Railway issue. Check these in order:

1. **Do NOT set PORT manually** - Railway auto-assigns PORT. Delete any PORT variable you've set.
2. **Check Deploy Logs** - Look for "Server listening on 0.0.0.0:XXXX" message
3. **Verify environment variables** - Missing `SUPABASE_DATABASE_URL` or `SESSION_SECRET` will crash the app
4. **Health check** - The server must respond to `/health` within 120 seconds of startup
5. **Check for startup errors** - Look for database connection or module import errors

### CORS Errors
- Ensure `ALLOWED_ORIGINS` includes your exact Vercel URL (with https://)
- Check there are no trailing slashes
- Multiple origins: separate with commas (no spaces): `https://app1.vercel.app,https://app2.vercel.app`

### Login Not Working
- Verify `SESSION_SECRET` is set in Railway (32+ characters)
- Ensure cookies are enabled in browser
- Check `ALLOWED_ORIGINS` is correctly configured
- Cross-site cookies require `sameSite: 'none'` and `secure: true` (already configured)

### Database Connection Errors
- Verify `SUPABASE_DATABASE_URL` uses the pooler connection (not direct)
- Format: `postgresql://postgres.PROJECT_ID:PASSWORD@aws-1-REGION.pooler.supabase.com:5432/postgres`
- Session pooler port is 5432, transaction pooler is 6543

### Build Failures
- Check Railway logs for specific errors
- Ensure all dependencies are in `package.json`
- The Docker build uses `node:20-bullseye-slim` (not Alpine) for Rollup compatibility

---

## Custom Domain (Optional)

### Vercel
1. Go to project settings → **Domains**
2. Add your domain (e.g., `dehadi.co.in`)
3. Update DNS records as instructed

### Railway
1. Go to project settings → **Networking** → **Generate Domain**
2. Or add custom domain and configure DNS

### Update Environment Variables
After adding custom domains:
- Update `ALLOWED_ORIGINS` in Railway with new frontend domain
- Update `VITE_API_URL` in Vercel with new backend domain

---

## Cost Breakdown

| Service | Free Tier Limits | Estimated Cost |
|---------|------------------|----------------|
| Vercel | 100GB bandwidth, unlimited deploys | $0 |
| Railway | $5 free credits/month, ~500 hours | $0-5 |
| Supabase | 500MB storage, 2GB bandwidth | $0 |

**Total: $0-5/month** for moderate traffic

---

## Scaling Up

When you outgrow free tiers:
- **Railway**: $5-20/month for always-on instances
- **Vercel Pro**: $20/month for more bandwidth
- **Supabase Pro**: $25/month for more storage

Consider Replit Deployments (~$7/month) as an all-in-one alternative.

---

## Alternative Deployment Options

If Railway continues to have issues, consider these alternatives:

### Option 1: Render (Recommended Alternative)
**Free tier**: 750 hours/month (enough for always-on small app)

1. Go to [render.com](https://render.com) and sign up
2. Create **New Web Service** → Connect GitHub repo
3. Configure:
   - **Build Command**: `npm run build`
   - **Start Command**: `node dist/index.js`
   - **Environment**: Add same env vars as Railway
4. Render auto-detects Node.js and deploys

**Pros**: Better free tier, simpler setup, no Docker required
**Cons**: Cold starts on free tier (sleeps after 15 min inactivity)

### Option 2: Fly.io
**Free tier**: 3 shared VMs, 160GB bandwidth

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Create app: `fly launch` (uses existing Dockerfile)
3. Set secrets: `fly secrets set SUPABASE_DATABASE_URL=... SESSION_SECRET=...`
4. Deploy: `fly deploy`

**Pros**: Global edge deployment, always-on
**Cons**: Steeper learning curve, credit card required

### Option 3: Replit Deployments
**Cost**: ~$7/month for always-on Reserved VM

1. Already on Replit - use built-in deployment
2. Configure deploy workflow in Replit
3. Uses same codebase, no migration needed

**Pros**: Simplest option, all-in-one platform
**Cons**: Costs money from day 1

### Quick Comparison

| Platform | Free Tier | Cold Starts | Docker | Difficulty |
|----------|-----------|-------------|--------|------------|
| Railway | $5 credits/month | No | Yes | Medium |
| Render | 750 hrs/month | Yes (15 min) | Optional | Easy |
| Fly.io | 3 VMs | No | Yes | Hard |
| Replit | None | No | No | Easy |
