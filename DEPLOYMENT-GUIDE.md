# HireConnect Deployment Guide

## Prerequisites for Deployment

### 1. Provision a PostgreSQL Database

Your application requires a PostgreSQL database. To provision one in Replit:

1. Click the **"Tools"** menu in the left sidebar
2. Select **"Database"**
3. Click **"Add Database"** and choose **PostgreSQL**
4. Replit will automatically provision a database and set the `DATABASE_URL` environment variable

**Important:** The `DATABASE_URL` will be automatically available in both:
- Development environment (local testing)
- Production deployment (published app)

### 2. Required Environment Variables

The following environment variables are required for deployment:

| Variable | Description | Auto-configured? |
|----------|-------------|-----------------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes (when you provision database) |
| `SESSION_SECRET` | Secret key for session encryption | ❌ No (add manually) |
| `RAZORPAY_KEY_ID` | Razorpay API key for payments | ❌ No (optional) |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret | ❌ No (optional) |

### 3. Adding Deployment Secrets

To add environment variables for deployment:

1. Click the **"Publish"** button (or **"Deploy"**)
2. In the deployment settings, look for **"Environment Variables"** or **"Secrets"**
3. Add the required secrets:
   - `SESSION_SECRET`: Generate a secure random string (at least 32 characters)
   - `RAZORPAY_KEY_ID`: Your Razorpay API key (if using payments)
   - `RAZORPAY_KEY_SECRET`: Your Razorpay API secret (if using payments)

**Example SESSION_SECRET generation:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Deployment Configuration

The application is configured for **autoscale** deployment in `.replit`:

```toml
[deployment]
deploymentTarget = "autoscale"
build = ["npm", "run", "build"]
run = ["npm", "run", "start"]
```

### What Happens During Deployment

1. **Build Phase:**
   - `npm run build` runs
   - Frontend assets are built to `dist/public/`
   - Backend is bundled to `dist/index.js`

2. **Run Phase:**
   - `npm run start` executes
   - Server starts on port 8080
   - Server binds to `0.0.0.0` (required for production)
   - Database migrations run automatically

## Deployment Fixes Applied

The following fixes have been applied to resolve deployment issues:

### ✅ 1. Server Binding Configuration
**Issue:** Server was binding to `localhost` which doesn't work in production deployments.

**Fix:** Server now binds to `0.0.0.0` in production, `localhost` in development.

```typescript
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
server.listen(port, host, () => {
  // ...
});
```

### ✅ 2. Build Output Verification
**Issue:** Deployment requires `dist/index.js` to exist.

**Fix:** Build script tested and verified to produce:
- `dist/index.js` (49.8KB) - Backend server
- `dist/public/` - Frontend assets

### ✅ 3. Database URL Configuration
**Issue:** Missing DATABASE_URL causes immediate crash.

**Fix:** Enhanced error messages guide you to provision a database through Replit's UI.

### ✅ 4. Error Handling
**Issue:** Application exits immediately on errors.

**Fix:** Improved error logging with helpful messages instead of silent failures.

## Troubleshooting

### "DATABASE_URL must be set" Error

**Cause:** No database provisioned

**Solution:**
1. Go to Tools → Database in Replit
2. Add a PostgreSQL database
3. Redeploy your application

### "Application is crash looping" Error

**Causes:**
1. Missing DATABASE_URL (see above)
2. Missing SESSION_SECRET in deployment secrets
3. Build failure

**Solution:**
1. Check deployment logs for specific error messages
2. Verify all required secrets are configured
3. Run `npm run build` locally to test the build process

### Build Failures

**Cause:** Dependencies or TypeScript errors

**Solution:**
```bash
# Test the build locally
npm run build

# Check for TypeScript errors
npm run check

# Verify dependencies
npm install
```

### Database Connection Issues

**Cause:** Incorrect DATABASE_URL or database not accessible

**Solution:**
1. Verify database is provisioned in Replit
2. Check deployment logs for connection errors
3. Ensure DATABASE_URL secret is present in deployment settings

## Testing Before Deployment

Before deploying, test your application:

```bash
# 1. Run tests
npm test

# 2. Build the application
npm run build

# 3. Test production build locally
NODE_ENV=production DATABASE_URL=your_db_url SESSION_SECRET=test_secret npm run start
```

## Deployment Checklist

- [ ] PostgreSQL database provisioned in Replit
- [ ] DATABASE_URL automatically configured
- [ ] SESSION_SECRET added to deployment secrets (32+ character random string)
- [ ] RAZORPAY keys added (if using payments)
- [ ] Application builds successfully (`npm run build`)
- [ ] No TypeScript errors (`npm run check`)
- [ ] Tests pass (`npm test`)
- [ ] Deployment settings reviewed in Publish/Deploy UI

## Post-Deployment

After successful deployment:

1. **Test your live application:**
   - Visit your deployment URL
   - Test login/registration
   - Verify database connections work
   - Check payment integration (if configured)

2. **Monitor logs:**
   - Check deployment logs for any errors
   - Monitor authentication warnings
   - Watch for database connection issues

3. **Set up monitoring:**
   - Enable Replit's uptime monitoring
   - Set up alerts for downtime
   - Monitor error rates

## Getting Help

If you encounter issues:

1. Check the deployment logs in Replit's deployment panel
2. Review this guide for common solutions
3. Verify all environment variables are set correctly
4. Test the build process locally: `npm run build`

## Additional Resources

- Replit Deployment Documentation: https://docs.replit.com/
- PostgreSQL Connection Guide: See Replit Database documentation
- Application Architecture: See `replit.md` for technical details

---

**Note:** The application uses autoscale deployment, which means:
- Server runs only when there's traffic
- Automatic scaling based on load
- Cost-effective for variable traffic patterns
- DATABASE_URL and other secrets are automatically injected at runtime
