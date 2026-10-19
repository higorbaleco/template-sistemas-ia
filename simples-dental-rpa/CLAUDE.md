# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Simples Dental RPA** is a Robotic Process Automation layer that integrates AI with Simples Dental, a dental practice management system that lacks a public API. The solution uses Playwright to automate browser interactions and reverse-engineers the internal API by capturing network traffic.

### Key Constraint
Simples Dental has no official API or webhooks. Integration happens entirely through browser automation (RPA), which means:
- The system is fragile to UI changes
- Session persistence is critical (save login state between runs)
- Network capture is the primary method to understand available actions
- Health data sensitivity (LGPD compliance) is a consideration

## Common Development Commands

```bash
# Initial setup
npm install
npx playwright install chromium
cp .env.example .env  # Fill in SIMPLESDENTAL_EMAIL and SIMPLESDENTAL_PASSWORD

# Core commands
npm run login              # Authenticate with Simples Dental, save session
npm run capture            # Record all network calls while navigating the UI manually
npm run list-appointments  # List appointments (currently a stub)
npm run get-patient        # Get patient details (currently a stub)
npm run create-appointment # Create appointment (currently a stub)

# HEADLESS=false in .env to see the browser during execution
# HEADLESS=true (default) runs headless
```

## Architecture Overview

The codebase is organized around these core layers:

```
src/
  cli.js              # Entry point; dispatcher for commands
  browser.js          # Playwright context management; reuses saved session
  auth/
    login.js          # Authentication flow; persists storageState to session.json
  pages/              # Page Objects (planned; will hold UI selectors)
  actions/            # High-level operations called by CLI (planned)
  storage/
    db.js             # SQLite (better-sqlite3) with 3 tables

scripts/
  capture-network.js  # Intercepts all fetch/XHR during manual navigation

data/
  session.json        # Saved Playwright storageState (git-ignored)
  simples-dental.db   # SQLite database
  network-capture/    # Raw JSON dumps from network capture
```

### Session Persistence Pattern
Browser context is reused across runs via `data/session.json` (Playwright's `storageState`). This avoids repeated login and reduces anti-bot detection risk. See `src/browser.js:openContext()` and `src/auth/login.js`.

### Database Schema
Three main tables in SQLite (WAL journal mode):
- **appointments**: id, patient_name, starts_at, status, raw_json, captured_at
- **patients**: id, name, raw_json, captured_at
- **raw_captures**: id, method, url, status, request_body, response_body, captured_at

The `raw_captures` table is a staging area for network intercepts—data is stored raw until the API schema is understood.

## Development Workflow

### 1. Implementing New Actions
1. Run `npm run login` if no session exists
2. Run `HEADLESS=false npm run capture` to start network recording
3. Navigate the Simples Dental UI manually to perform the desired action (e.g., open Agenda, click patient, confirm appointment)
4. Close the browser; network data is saved to `data/network-capture/*.json` and `raw_captures` table
5. Examine the captured requests to identify:
   - Which endpoint(s) power the action
   - Request payload structure
   - Response shape
6. Implement the action in `src/actions/` using direct API calls (fetch + session cookies) rather than UI clicks—this is faster and more stable
7. Wire the action into `src/cli.js` command dispatcher

### 2. Debugging Login Issues
If login fails in `src/auth/login.js`:
1. Set `HEADLESS=false` in `.env`
2. Run `npm run login` and observe where it fails
3. Update CSS selectors in `login.js` to match the current UI
4. Look for `TODO` comments in `login.js` for known fragile areas

### 3. Adding Page Objects
For complex UI interactions, create files in `src/pages/` following the Page Object pattern:
```javascript
// src/pages/AppointmentPage.js
export class AppointmentPage {
  constructor(page) {
    this.page = page;
  }
  
  async getAppointmentList() {
    // selectors and interactions here
  }
}
```

## Environment Variables (.env)

- `SIMPLESDENTAL_EMAIL`: Login email
- `SIMPLESDENTAL_PASSWORD`: Login password
- `HEADLESS`: Set to `false` to see browser; defaults to `true`

Copy `.env.example` to `.env` and fill these in. `.env` is git-ignored.

## Important Notes

### Security & Compliance
- Patient data in `data/simples-dental.db` is health-sensitive (LGPD-regulated)
- Credentials are never committed; they stay in `.env` only
- Session state (`data/session.json`) is git-ignored

### Stability
- UI selectors in `src/auth/login.js` and `src/pages/` may break if Simples Dental updates their frontend
- Network API is more stable than UI automation; prioritize capturing and calling the internal API directly
- Always test changes against the real Simples Dental instance (in a test account if possible)

### Status
Many CLI commands are currently stubs (`list-appointments`, `get-patient`, `create-appointment`). Implementation depends on network capture results. Once the internal API is documented, these are straightforward to implement.

## Testing & Verification

Currently, no automated test suite. Validation is manual:
1. Run the command with `HEADLESS=false` to watch it execute
2. Check `data/simples-dental.db` for the expected data
3. Inspect network captures in `data/network-capture/` for API structure

Consider adding tests in the future as the API surface stabilizes.
