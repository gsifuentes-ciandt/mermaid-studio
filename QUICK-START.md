# 🚀 Quick Start Guide

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create `.env.local` in the project root:

```bash
# Backend Variables (for server/proxy.js and netlify/functions/)
# NO VITE_ prefix - these are server-side only
FLOW_CLIENT_ID=your-client-id
FLOW_CLIENT_SECRET=your-client-secret
FLOW_APP_TO_ACCESS=llm-api
FLOW_TENANT=lithiadw
FLOW_AGENT=mermaid-studio

# Frontend Variables (exposed to browser)
# MUST have VITE_ prefix
VITE_OPENAI_API_KEY=your-openai-key
```

**Important**: 
- Backend variables (FLOW_*) = NO `VITE_` prefix
- Frontend variables = MUST have `VITE_` prefix

### 3. Start Development Servers

**Terminal 1 - Proxy Server** (handles AI API calls):
```bash
cd server
npm start
```

**Terminal 2 - Frontend** (React app):
```bash
npm run dev
```

### 4. Open Browser

Navigate to: http://localhost:5173

---

## Common Issues

### ❌ "FLOW_CLIENT_ID and FLOW_CLIENT_SECRET environment variables are required"

**Problem**: Proxy server can't find credentials

**Solution**:
1. Make sure `.env.local` exists in project root (not in `server/` folder)
2. Verify the file contains `FLOW_CLIENT_ID` and `FLOW_CLIENT_SECRET`
3. Restart the proxy server: `cd server && npm start`

### ❌ "Connection Error" in AI Chat

**Problem**: Frontend can't reach proxy server

**Solution**:
1. Make sure proxy server is running on port 3001
2. Check Terminal 1 for any error messages
3. Verify `.env.local` has correct credentials

### ❌ "Authentication Error"

**Problem**: Invalid Flow API credentials

**Solution**:
1. Verify credentials are correct in `.env.local`
2. Check credentials haven't expired
3. Contact your administrator for new credentials

---

## Testing

### Run Unit Tests

```bash
npm test
```

### Test AI Integration

```bash
# Test Flow API authentication
node server/test-auth.js
```

---

## Deployment to Netlify

See **AGENTS.md** → "Deployment & Testing" section for complete deployment instructions.

**Quick checklist**:
1. ✅ Push code to `main` branch
2. ✅ Add environment variables in Netlify dashboard
3. ✅ Netlify auto-deploys
4. ✅ Test `/api/health` endpoint

---

## Project Structure

```
mermaid-studio/
├── src/                    # Frontend React app
├── server/                 # Local proxy server (dev only)
├── netlify/functions/      # Production serverless functions
├── .env.local             # Local credentials (gitignored)
├── .env.example           # Template for credentials
└── AGENTS.md              # Complete documentation for AI agents
```

---

## Need Help?

- **Full Documentation**: See `AGENTS.md`
- **User Guide**: See `README.md`
- **Issues**: Check browser console and terminal logs
