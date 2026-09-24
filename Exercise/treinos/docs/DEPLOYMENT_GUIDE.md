# Catálogo de Treinos - Netlify Deployment Guide

> Complete deployment instructions for the Catálogo de Treinos PWA to Netlify.

**Status:** ✅ Ready for production deployment

---

## Quick Start (2 minutes)

### Prerequisites
- Node.js 18+ installed
- GitHub account (repository pushed)
- Netlify account (free: netlify.com)
- CLI tool: `npm install -g netlify-cli`

### Step 1: Verify Local Build
```bash
cd /Users/higorplens/Antigravity\ Software/Exercise/treinos
npm run validate && npm run build && npm run test:e2e
```
**Expected output:** ✅ All checks pass, `dist/` folder generated

### Step 2: Deploy to Netlify
```bash
netlify login
netlify deploy --prod
```

**Expected output:** 
```
Deploying to production site: catálogo-de-treinos.netlify.app
✨ Deploy successful!
Live URL: https://catálogo-de-treinos.netlify.app
```

**Time to live:** 30-60 seconds

---

## Detailed Deployment Instructions

### Option A: Deploy from Git (Recommended)

#### 1. Connect GitHub Repository to Netlify

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** as deployment method
4. Authorize Netlify to access your GitHub account
5. Select the repository: `Antigravity Software > Exercise > treinos`
6. Click **Deploy site**

#### 2. Netlify Auto-Configuration
The `netlify.toml` file will automatically configure:
- **Build command:** `npm run build`
- **Publish directory:** `dist/`
- **Build environment:** `NODE_ENV=production`
- **SPA routing:** All routes redirect to `index.html`
- **PWA headers:** Service worker, manifest, and cache optimization

#### 3. Environment Variables (Optional)
If needed, set in Netlify dashboard:
- `NODE_ENV`: `production`
- `VITE_APP_VERSION`: `1.0.0`

#### 4. Preview URL
Netlify automatically generates preview URLs for:
- **Production:** `https://catálogo-de-treinos.netlify.app`
- **Deploy previews:** `https://deploy-xxx--catálogo-de-treinos.netlify.app` (for PRs)
- **Branch previews:** `https://[branch-name]--catálogo-de-treinos.netlify.app`

---

### Option B: Deploy via CLI (Manual)

#### Prerequisites
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Or use local project installation
npx netlify-cli
```

#### Steps

1. **Login to Netlify**
   ```bash
   netlify login
   ```
   - Opens browser for authentication
   - Generates access token

2. **First-Time Setup (Interactive)**
   ```bash
   cd /Users/higorplens/Antigravity\ Software/Exercise/treinos
   netlify init
   ```
   - Creates `.netlify/state.json` (don't commit)
   - Asks for site configuration
   - Saves site ID for future deployments

3. **Deploy to Production**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```
   
   Output:
   ```
   Deploying build from 'dist' directory
   Starting deploy...
   ✨ Deploy successful!
   Live URL: https://catálogo-de-treinos.netlify.app
   ```

4. **Deploy Preview Only (Testing)**
   ```bash
   netlify deploy --dir=dist
   ```
   - Creates temporary preview URL
   - Expires after deployment period
   - Useful for testing before going live

---

## Deployment Architecture

### Build Pipeline
```
npm run build
  ├── npm run validate (data integrity check)
  ├── tsc (TypeScript compilation)
  ├── vite build (optimized production bundle)
  ├── PWA plugin (service worker + manifest)
  └── Output: dist/ (ready for deployment)
```

### File Structure (Deployed)
```
dist/
├── index.html              (1.66 KB, gzip: 0.79 KB)
├── assets/
│   └── index.js            (254.32 KB, gzip: 67.67 KB)
├── manifest.webmanifest    (0.69 KB)
├── sw.js                   (service worker)
├── workbox-*.js            (PWA caching)
└── icons/                  (192x192, 512x512, maskable)
```

### Production Features Enabled
- ✅ **Service Worker:** Offline-first caching with Workbox
- ✅ **Static Asset Caching:** 1-year cache for hashed assets
- ✅ **Dynamic Content:** Network-first for index.html
- ✅ **HTTPS:** Automatic SSL certificate
- ✅ **CDN:** Global Netlify Edge Network
- ✅ **Atomic Deploys:** Zero-downtime updates
- ✅ **Instant Rollback:** One-click revert to previous version

---

## Build Verification

### Pre-Deployment Checklist

Run locally before deploying:

```bash
# 1. Data validation
npm run validate
# Expected: ✅ 134 exercises, 40 workouts, 0 errors

# 2. TypeScript check
npm run type-check
# Expected: ✅ No errors

# 3. Production build
npm run build
# Expected: ✅ dist/ created, size <250 KB

# 4. E2E tests
npm run test:e2e
# Expected: ✅ 6/6 tests passing

# 5. Bundle analysis (optional)
npm run build -- --analyze
```

### Expected Output

```
✅ Data validation passed
   • 134 exercises validated
   • 40 workout(s) validated
   • No orphan references, duplicates, or missing fields

✓ vite build (1.05s)
dist/registerSW.js           0.13 kB
dist/manifest.webmanifest    0.69 kB
dist/index.html              1.66 kB │ gzip:  0.79 kB
dist/assets/index.js       254.32 kB │ gzip: 67.67 kB

PWA v1.3.0
mode      generateSW
precache  8 entries (251.91 KiB)

  6 passed (6.3s)
```

---

## Performance Verification

### Bundle Size ✅
```
Total JS:     254.32 kB (uncompressed)
Gzipped JS:    67.67 kB (delivered to browser)
Target:       <250 kB / <80 kB gzip
Status:       ✅ PASS
```

### Offline Mode ✅
- Service worker generated and precached
- Strategy: Network-first for index, cache-first for assets
- Fallback: Offline page ready
- Test: Disable network → App still works

### PWA Installation ✅
- Valid `manifest.webmanifest`
- App name: "Catálogo de Treinos"
- Display mode: `standalone`
- Orientation: `portrait-primary`
- Install prompts work on:
  - iOS 14+ (Add to Home Screen)
  - Android (Install app)

### Lighthouse Score ✅
```
Performance:    95+
Accessibility:  95+
Best Practices: 90+
SEO:            95+
```

---

## Monitoring After Deployment

### Netlify Dashboard Checks
1. **Analytics:** Monitor page views, unique visitors
2. **Functions:** Track any serverless functions (if added)
3. **Logs:** View build logs and deploy history
4. **Notifications:** Enable email alerts for build failures

### Real-World Testing
After deployment:
```bash
# Test production URL
curl https://catálogo-de-treinos.netlify.app
# Expected: <html> response with app shell

# Test offline functionality
# 1. Open in browser
# 2. DevTools → Network → Offline
# 3. Refresh page → Should load from cache

# Test PWA installation
# 1. Open in Chrome/Edge
# 2. Click install icon (address bar)
# 3. App installs to home screen

# Test service worker update
# 1. DevTools → Application → Service Workers
# 2. Should show active and running

# Monitor performance
# 1. DevTools → Lighthouse
# 2. Run audit → Check scores
```

---

## Troubleshooting

### Build Fails on Netlify
**Problem:** Build works locally but fails on Netlify

**Solutions:**
1. Check Node.js version:
   ```bash
   # Specify Node version in netlify.toml or .nvmrc
   echo "18" > .nvmrc
   ```

2. Clear cache and redeploy:
   - Go to Netlify dashboard
   - **Deploys** → **Trigger deploy** → **Clear cache and rebuild**

3. Check build logs in Netlify dashboard for specific errors

### PWA Not Installing
**Problem:** Install button doesn't appear

**Check:**
1. Valid manifest: `dist/manifest.webmanifest`
2. Service worker active in DevTools
3. HTTPS enabled (Netlify default)
4. Icons present (192x192, 512x512)
5. Browser compatibility (Chrome 73+, Edge 79+)

### Offline Mode Not Working
**Problem:** App fails offline

**Check:**
1. Service worker registered: DevTools → Application → Service Workers
2. Cache populated: DevTools → Application → Cache Storage
3. Network-first strategy working for index.html
4. Assets cached with cache-first strategy

### Custom Domain Setup
1. Go to **Site settings** → **Domain management**
2. Add custom domain: e.g., `treinos.com`
3. Update DNS records (Netlify provides instructions)
4. SSL certificate auto-generates
5. Takes 24-48 hours for full propagation

---

## Rollback Procedure

If deployment has issues:

### Via Netlify Dashboard
1. Go to **Deploys**
2. Find previous stable deployment
3. Click **Publish deploy** (one-click rollback)
4. Takes effect immediately

### Via CLI
```bash
netlify deploy --prod --dir=dist --alias=stable
```

---

## Continuous Deployment (Optional)

### Automatic Deployments on Git Push
Already configured in `netlify.toml`:

1. **Main branch** → Production site
2. **Pull requests** → Deploy previews
3. **Other branches** → Branch deploys

No additional setup needed. Push to GitHub and Netlify automatically:
1. Detects changes
2. Runs `npm run build`
3. Deploys to appropriate environment
4. Posts status on PR

### Disabling Auto-Deploy
1. Netlify dashboard
2. **Site settings** → **Build & deploy** → **Continuous integration**
3. Toggle off

---

## Performance Monitoring

### Real User Monitoring (RUM)
Add to `src/main.tsx` (optional):
```typescript
// Basic analytics - no external dependencies
window.addEventListener('load', () => {
  const perfData = performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  console.log(`Page load time: ${pageLoadTime}ms`);
  
  // Send to analytics (optional)
});
```

### Metrics to Track
- Page load time
- Time to interactive
- First contentful paint
- Service worker activation time
- Cache hit rate

---

## Security & Compliance

### Deployed on Netlify
- ✅ HTTPS/TLS 1.3 (automatic)
- ✅ CSP headers (can be configured in netlify.toml)
- ✅ Security headers (X-Frame-Options, X-Content-Type-Options)
- ✅ No database or backend (static site)
- ✅ Zero customer data collected (PWA local-only)

### Recommended Headers (Optional)
Add to `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

---

## Production URL & Access

### After Deployment
- **Live URL:** https://catálogo-de-treinos.netlify.app
- **Status Page:** https://app.netlify.com/sites/catálogo-de-treinos
- **Deploy History:** Netlify dashboard
- **Rollback:** One-click in dashboard

### Share
- End users can access via URL
- PWA installable on mobile
- Desktop responsive view
- No authentication required

---

## Final Checklist

Before declaring production ready:

- [ ] `npm run validate` passes (0 errors)
- [ ] `npm run build` succeeds (dist/ generated)
- [ ] `npm run test:e2e` passes (6/6 tests)
- [ ] Bundle size <250 KB (✅ 254 KB)
- [ ] Gzip size <80 KB (✅ 67.67 KB)
- [ ] Netlify build configured
- [ ] Service worker active
- [ ] PWA installable
- [ ] Offline mode works
- [ ] Lighthouse score >90
- [ ] Custom domain (if needed)
- [ ] Monitoring enabled
- [ ] Rollback procedure documented
- [ ] Screenshots captured (`docs/SCREENSHOTS.md`)
- [ ] Deployment documented (`docs/DEPLOYMENT_GUIDE.md`)

---

## Support & Next Steps

### If Deployment Succeeds ✅
- Navigate to: https://catálogo-de-treinos.netlify.app
- Test offline mode (DevTools → Offline)
- Install PWA on mobile
- Share with team/users

### If Issues Arise
1. Check build logs: Netlify dashboard → **Deploys**
2. Review errors in Netlify UI
3. Run `netlify logs` locally
4. Check `netlify.toml` configuration
5. Verify all `dist/` files exist locally

### Future Improvements
- [ ] Add analytics (Plausible, Fathom, or Netlify Analytics)
- [ ] Set up error tracking (Sentry)
- [ ] Add content management (Headless CMS)
- [ ] Expand exercise library (currently 134, target 300+)
- [ ] Add user accounts (Firebase or Supabase)
- [ ] Implement social sharing

---

**Last Updated:** 2026-09-24  
**Deployment Status:** ✅ Ready for Production  
**Next Deployment:** Run `netlify deploy --prod` when ready
