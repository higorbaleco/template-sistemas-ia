# Catálogo Lab Mobile-First Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Catálogo Lab into a lightweight, mobile-first Bento-style catalog system with fast filters, copyable IA endpoints, and Netlify-ready deployment.

**Architecture:** Keep the MVP as a single Next.js app with seed data in TypeScript, server-rendered catalog pages, and a small client layer only where interaction is required. Use URL-driven filters, precomputed in-memory indexes, and static-friendly rendering so the UI stays fast on mobile and deploys cleanly on Netlify.

**Tech Stack:** Next.js 14, React 18, TypeScript 5.5, native CSS, Netlify

## Global Constraints

- App stays simple: catalog pages, filters, copyable endpoints, and item details only.
- Mobile-first Bento professional UI with strong touch targets and no horizontal scrolling.
- URL reflects state via query params for filters and search.
- No database or admin CRUD in the MVP; data remains in local TypeScript seed files.
- Endpoints must mirror the human-facing catalog views.
- Build must be deployable on Netlify without custom backend services.
- Accessibility requirements: semantic HTML, visible focus states, labeled form controls, reduced-motion support.

---

### Task 1: Mobile-First Bento Shell & Navigation

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/catalogos/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `segments` and `companies` from `lib/catalog-data.ts`
- Produces: a compact dashboard, bento category cards, mobile-first nav, and visually consistent page chrome for all catalog screens

- [ ] **Step 1: Rewrite the shell for mobile-first behavior**
  - Add a skip link, `theme-color`, and metadata that matches the dark Bento theme.
  - Use a single top-level container with safe-area padding and no horizontal overflow.

- [ ] **Step 2: Refine the home/dashboard layout**
  - Make the first fold show the catalog value proposition, 4 segment cards, and 1 primary CTA.
  - Turn company cards into lightweight gateway cards that open the corresponding catalog segment.

- [ ] **Step 3: Restyle global tokens**
  - Replace the current generic feel with a Bento grid, tighter spacing scale, stronger border rhythm, and touch-friendly controls.
  - Add `prefers-reduced-motion` handling and visible `:focus-visible` states.

- [ ] **Step 4: Verify the shell on narrow viewports**
  - Check 375px, 768px, 1024px, and 1440px layouts by running the app and inspecting the pages manually.

- [ ] **Step 5: Commit**
  - Commit the UI shell pass once the pages are responsive and visually coherent.

### Task 2: Catalog Data, Indexes, Filtering & Copyable IA Endpoints

**Files:**
- Modify: `lib/catalog-data.ts`
- Modify: `lib/catalog-types.ts`
- Modify: `lib/catalog-utils.ts`
- Create: `lib/catalog-index.ts`
- Modify: `components/catalog-explorer.tsx`
- Modify: `app/catalogos/[segment]/[slug]/page.tsx`
- Modify: `app/api/catalogos/[segment]/route.ts`
- Create: `app/api/catalogos/[segment]/[slug]/route.ts`

**Interfaces:**
- Consumes: seed item arrays and segment metadata
- Produces: precomputed search indexes, URL-safe filter helpers, segment/item JSON endpoints, and item detail pages that mirror the public catalog

- [ ] **Step 1: Write the failing tests / assertions**
  - Add focused checks for filter matching, slug lookup, and endpoint payload shape.
  - Include a test that a search like `SUV automático até 130 mil` resolves to the intended filters.

- [ ] **Step 2: Precompute indexes for speed**
  - Build a small in-memory catalog index keyed by segment and item slug for search corpus, facets, and quick lookup.
  - Keep indexing deterministic and derived from the seed data only.

- [ ] **Step 3: Reduce client work in the explorer**
  - Keep filter state URL-driven and cheap per keystroke.
  - Ensure copy actions use small client handlers, while list rendering remains mostly server-driven.

- [ ] **Step 4: Mirror the public catalog in JSON**
  - Keep `/api/catalogos/:segment` and `/api/catalogos/:segment/:slug` in sync with the UI.
  - Return `count`, `filters`, and `items` for list endpoints; return the single `item` for detail endpoints.

- [ ] **Step 5: Validate deep links and detail pages**
  - Confirm each item page renders the same data the API returns and the URL can be copied directly into the IA system.

- [ ] **Step 6: Commit**
  - Commit the data/index/API pass once filtering and endpoint parity are correct.

### Task 3: Netlify Readiness, Performance & Final QA

**Files:**
- Modify: `next.config.mjs`
- Create: `netlify.toml`
- Modify: `package.json`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `README.md`

**Interfaces:**
- Consumes: finished app routes, data indexes, and filter behavior
- Produces: Netlify-friendly build settings, clear run instructions, and a final build that passes in production mode

- [ ] **Step 1: Add Netlify build metadata**
  - Add `netlify.toml` with the build command, Node version, and Next.js plugin-friendly defaults.
  - Keep the app compatible with Netlify’s Next.js runtime rather than introducing extra services.

- [ ] **Step 2: Tighten performance**
  - Keep lists and item cards lean, avoid heavy client state, and ensure the catalog pages render quickly.
  - Add any small CSS optimizations that reduce layout shift and preserve mobile scroll performance.

- [ ] **Step 3: Verify accessibility and touch behavior**
  - Ensure labels, focus rings, and button sizes satisfy the web interface guidelines.
  - Confirm `touch-action`, reduced motion, and readable type sizes on mobile.

- [ ] **Step 4: Run production checks**
  - Run `npm run build`.
  - Open the app in local preview and verify the main dashboard, one segment page, one detail page, and one API route.

- [ ] **Step 5: Update docs**
  - Document the main URLs, Netlify deploy assumption, and how to seed or extend the catalog data.

- [ ] **Step 6: Commit**
  - Commit the Netlify-ready pass after build verification.
