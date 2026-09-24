# Deployment Guide

> **Catálogo de Treinos** — Production deployment, preview, and troubleshooting

---

## Overview

This application is deployed to **Netlify** with automatic builds triggered on every push to the main branch. The app is a React + Vite SPA (Single Page Application) with PWA capabilities (Service Worker, offline support, installable).

**Production URL:** `https://treinos.netlify.app` (or your custom domain)

---

## Production Deployment

### Automatic Deploy (Recommended)

1. **Push to `main` branch**
   ```bash
   git commit -m "feature: add new workouts"
   git push origin main
   ```

2. **Netlify automatically:**
   - Detects the push
   - Runs `npm run build` (which includes validation and TypeScript checks)
   - Deploys build artifacts from `dist/` to production
   - Updates the live site within 1-2 minutes

3. **Monitor deploy:**
   - Go to [Netlify Dashboard](https://app.netlify.com) → Deploys
   - Watch the build log in real-time
   - Success: Green checkmark, live site updated

### Manual Deploy (CLI)

If you need to deploy without pushing to git:

```bash
# Install Netlify CLI (one-time)
npm install -g netlify-cli

# Login to your Netlify account
netlify login

# Deploy from dist/ folder
netlify deploy --prod --dir=dist
# (requires `npm run build` first)
```

---

## Preview Deployments

### Branch Preview URLs

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/new-workouts
   git push origin feature/new-workouts
   ```

2. **Netlify creates a preview URL:**
   - Check Netlify Dashboard → Deploys → Branch deploy section
   - URL format: `https://<branch-name>--treinos.netlify.app`
   - Share this URL with team for testing

3. **Update preview:**
   - Push new commits to the same branch
   - Preview automatically rebuilds

4. **Merge to production:**
   - Create a Pull Request on GitHub
   - Once approved, merge to `main`
   - Netlify deploys to production

---

## Build Configuration

### Build Command

```bash
npm run build
```

This runs:
1. **Data validation**: `npx ts-node scripts/validate-data.ts`
   - Checks for orphan exercise references
   - Validates required fields
   - Detects duplicate IDs
2. **TypeScript compilation**: `tsc`
3. **Vite build**: `vite build`
   - Bundles React + app code
   - Minifies with Terser
   - Generates `dist/` folder

### Build Environment

- **Development contexts:** `NODE_ENV=development`
- **Production contexts:** `NODE_ENV=production`
- **Version:** Set in `netlify.toml` as `VITE_APP_VERSION`

### Output Structure

```
dist/
├── index.html          (1.5 kB, not cached)
├── assets/
│   ├── index.js        (~250 kB gzip: <80 kB)
│   └── [name]-chunk.js (code splitting)
├── manifest.json       (cached 24 hours)
├── sw.js              (not cached, must-revalidate)
└── icons/
    ├── icon-192.png
    ├── icon-512.png
    └── icon-maskable.png
```

---

## Caching Strategy

Netlify serves files with specific cache headers to optimize load times and ensure updates:

### Long-Term Cache (1 year)
- `/assets/*.js` — Main app bundle and chunks
- `/fonts/*` — Google Fonts

### Short-Term Cache (24 hours)
- `/manifest.json` — PWA manifest, refreshed daily

### No Cache (must-revalidate)
- `/sw.js` — Service Worker, always fetch latest
- `/precache-manifest-*.js` — Workbox precache list
- `/*.html` — HTML files, never cached

This ensures:
- Users get new app code within 2-3 minutes of deploy
- Service Worker updates are applied on next app load
- Static assets remain cached for performance

---

## PWA & Service Worker

### Installation

After the app loads, users can:
1. **Android/Chrome:** Click "Install" prompt, add to home screen
2. **iOS Safari:** Tap Share → Add to Home Screen
3. **Web:** Use browser "Add to Home Screen" option

### Offline Mode

The Service Worker caches:
- HTML index
- JavaScript bundles
- CSS
- Static assets
- Exercise/workout data (JSON)

**Offline capabilities:**
- View cached workouts offline
- Mark exercises complete (saved to localStorage)
- Full workout flow works without internet

**Limitations:**
- Cannot load new exercises until online
- Cannot sync progress to cloud (no backend yet)

### Service Worker Updates

The app automatically checks for SW updates:
1. Every time app loads, checks for new service worker
2. If found, shows update prompt to user
3. User can restart app to apply new version
4. Next visit uses updated SW

---

## Troubleshooting

### Build Fails

**Symptom:** Deploy shows red "Build failed"

**Steps:**

1. Check build log in Netlify Dashboard:
   - Click Deploys → failed build → Build log
   - Look for error messages

2. Common causes:
   - **TypeScript error:** Fix in code, push new commit
   - **Data validation error:** Run `npm run validate` locally, fix orphan exercises
   - **Missing dependency:** Run `npm install`, commit `package-lock.json`
   - **Node version mismatch:** Check Netlify Node version vs local

3. Local build test:
   ```bash
   npm run build
   # If this fails locally, fix before pushing
   ```

### App Shows Blank Page

**Symptom:** Production URL loads but shows white/empty screen

**Steps:**

1. Check browser DevTools:
   - Open DevTools (F12)
   - Go to Console tab
   - Look for JavaScript errors

2. Check Network tab:
   - Verify `index.html` loaded (200 status)
   - Verify JS bundle loaded
   - Check for 404 errors

3. Check SPA redirect:
   - netlify.toml should have: `from = "/*"` → `to = "/index.html"` (200)
   - This ensures client-side routing works

4. Clear cache and reload:
   - Hard refresh: Ctrl+Shift+R (Win) or Cmd+Shift+R (Mac)
   - Clear cookies: DevTools → Storage → Clear All

### Service Worker Not Updating

**Symptom:** App still shows old version after deploy

**Steps:**

1. Service Worker is cached by browser:
   - New SW version installs on next app launch
   - Not automatic within same session

2. Force update:
   ```bash
   # In browser DevTools:
   # Application → Service Workers → Unregister
   # Then refresh page
   ```

3. Or: Hard refresh (Cmd+Shift+R) and close all tabs, then reopen

### PWA Install Prompt Missing

**Symptom:** "Add to Home Screen" button doesn't appear

**Possible causes:**

1. App not served over HTTPS (Netlify does this automatically)
2. manifest.json not loading (check Network tab)
3. Service Worker not registered (check Console)
4. App icon missing or wrong dimensions

**Check:**
- DevTools → Application → Manifest — verify all icons present
- DevTools → Application → Service Workers — verify registered

### Build Size Too Large

**Symptom:** Bundle exceeds 250 kB or gzip > 80 kB

**Steps:**

1. Analyze bundle:
   ```bash
   npm install -D @vite/plugin-visualizer
   # Add to vite.config.ts, rebuild, check output
   ```

2. Common optimizations:
   - Remove unused dependencies
   - Enable code splitting in Vite
   - Lazy load large components with React.lazy()

---

## Performance Monitoring

### Check Live Performance

After deploy, verify in production:

```bash
# Test production URL
curl -I https://treinos.netlify.app

# Check cache headers
# Look for: Cache-Control headers in response
```

### Lighthouse Audit

1. Open production URL in Chrome
2. DevTools → Lighthouse
3. Run "Mobile" audit
4. Check:
   - Performance > 80
   - PWA > 90
   - Accessibility > 90
   - Best Practices > 90

### Real User Metrics

Netlify Analytics (if enabled):
- Deploys → Analytics tab
- View page load times, error rates, geographic distribution

---

## Rollback

If deploy causes issues:

### Quick Rollback (Netlify)

1. Go to Netlify Dashboard → Deploys
2. Find last known-good deploy (green checkmark)
3. Click "..." → "Trigger deploy" or "Preview"
4. To make it production: Click "..." → "Publish deploy"

### Manual Rollback (Git)

```bash
# Revert last commit locally
git revert HEAD
git push origin main

# Netlify rebuilds from reverted code
# Deploy completes in 2-3 minutes
```

---

## Environment Variables

Environment variables used during build and runtime:

| Variable | Value | Purpose |
|---|---|---|
| `NODE_ENV` | `production` / `development` | Build optimization |
| `VITE_APP_VERSION` | `1.0.0` | App version in manifest |

To add more:
1. Update in `netlify.toml` under `[build]` or contexts
2. Push and redeploy
3. Access in app via `import.meta.env.VITE_*`

---

## Custom Domain

To use a custom domain (e.g., `treinos.higor.com`):

1. Go to Netlify Dashboard → Site settings → Domain management
2. Click "Add custom domain"
3. Follow DNS setup instructions (varies by registrar)
4. HTTPS is automatic via Netlify Certificate

---

## Monitoring & Alerts

### Set Up Deploy Notifications

1. Go to Netlify Dashboard → Site settings → Build & deploy
2. Link GitHub, Slack, or email
3. Get notified on:
   - Build start / finish
   - Deploy success / failure
   - Rollback

### Check Uptime

- Netlify automatically monitors uptime
- Dashboard shows last 7 days of deploy history
- Enable Netlify Status page for public status

---

## Security Checklist

- [ ] HTTPS enabled (automatic on Netlify)
- [ ] Service Worker served with `no-cache` headers
- [ ] No sensitive data in environment variables exposed to client
- [ ] HTML index never cached (always fresh)
- [ ] Static assets have immutable cache headers
- [ ] Redirects use `status = 200` (not `301` for SPA)

---

## Support & Resources

- **Netlify Docs:** https://docs.netlify.com
- **Vite Docs:** https://vitejs.dev
- **React Docs:** https://react.dev
- **PWA Checklist:** https://web.dev/install-criteria/

---

## FAQ

**Q: How long does a deploy take?**
A: Typically 1-2 minutes from push to live.

**Q: Can I deploy from a feature branch?**
A: Yes! Netlify creates preview URLs for every branch push.

**Q: Do I need to manually rebuild the Service Worker?**
A: No, vite-plugin-pwa generates it automatically during build.

**Q: How do I update the app version?**
A: Update `VITE_APP_VERSION` in `netlify.toml`, rebuild.

**Q: What if a build gets stuck?**
A: Cancel in Netlify Dashboard, fix the issue locally, and push again.

---

**Last updated:** 2026-09-24
