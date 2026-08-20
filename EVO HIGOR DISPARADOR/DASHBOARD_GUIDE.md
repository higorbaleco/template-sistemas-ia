# Dashboard Quick Start Guide

## Launch
```bash
npm run dev
# Open http://localhost:3000
```

## First Run — Setup Tab
1. **Bootstrap Organization** (if first time)
   - Setup token: `[SETUP_TOKEN]` from env
   - Organization name: `Acme` (or your name)
   - Click "Create Organization"
   - Save the API key shown

2. **Connect API Key**
   - Paste your API key
   - Click "Save Key"
   - Status turns 🟢 Online

3. **Optional: Save API Settings**
   - Evolution API credentials
   - Maturador webhook secret
   - Click "Save Settings"

## Instances Tab — Create WhatsApp Instance
1. Click card "Create New Instance"
2. Fill:
   - Display Name: `Sales`
   - Instance ID: `sales` (slug)
   - Phone: `+5511999999999` (optional)
3. Click "Create Instance"
4. Instance appears in "Active Instances" list

## Messages Tab — Send Messages
1. Fill form:
   - Instance Name: `sales`
   - Recipient: `+5511988888888`
   - Message: `Hello! This is a test.`
   - Schedule: (optional) ISO datetime like `2026-08-20T14:30:00Z`
2. Click "Queue Message"
3. Message appears in "Pending Messages" with status

## Logs Tab — Monitor
- View last 20 events
- Message logs + webhook events
- Timestamps auto-refreshed every 15s

## Keyboard Tips
- **Tab** through form fields
- **Enter** submits form on last field
- Click nav items to switch tabs instantly

## Status Indicators
- 🟢 **Online** = API connected
- 🔴 **Offline** = No API key saved
- ✓ **Success** = Operation completed
- ✗ **Error** = Check message in alert

## Storage
All credentials stored in browser localStorage:
- API Key
- Setup Token  
- Evolution credentials
- Maturador settings

**Clear:** Settings tab → "Clear All"

## API Endpoints Used
- `POST /setup/organizations` — Create first org
- `GET/POST /api/v1/instances` — Manage instances
- `GET/POST /api/v1/messages` — Queue messages
- `GET /api/v1/logs` — Fetch events

## Troubleshooting
- **"No instances"** → Setup & Connect first
- **Message won't send** → Instance must exist
- **Data not loading** → Check API key, refresh page
- **Page looks broken** → Hard refresh (⌘⇧R / Ctrl+Shift+R)

---

**Last updated:** 2026-08-20  
**Version:** 1.0 (Redesigned)
