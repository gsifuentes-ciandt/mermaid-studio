# 🚀 Netlify Deployment Guide

## ✅ All Files Ready!

Your application is now **fully prepared** for Netlify deployment with user-specific credentials support!

---

## 📋 Pre-Deployment Checklist

### ✅ Files Already Configured:

1. ✅ **Netlify Function**: `netlify/functions/chat-completions.js`
   - Supports user credentials from headers
   - Supports fallback credentials from env variables
   - Token caching per user
   - CORS configured

2. ✅ **Build Configuration**: `netlify.toml`
   - Build command configured
   - Redirects configured
   - Functions configured

3. ✅ **Frontend Configuration**:
   - FlowProvider sends credentials in headers
   - AI service loads user preferences
   - Credentials encrypted in database

---

## 🔧 Deployment Steps

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

---

### Step 2: Create Netlify Site

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect to your GitHub repository
4. Select the repository

---

### Step 3: Configure Build Settings

**Build settings** (should auto-detect from `netlify.toml`):
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Functions directory**: `netlify/functions`

Click "Deploy site"

---

### Step 4: Add Environment Variables

Go to **Site settings** → **Environment variables** → **Add a variable**

#### Required Variables:

```bash
# Supabase (REQUIRED)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Flow API (OPTIONAL - for fallback)
FLOW_CLIENT_ID=your-client-id
FLOW_CLIENT_SECRET=your-client-secret
FLOW_TENANT=lithiadw
FLOW_AGENT=mermaid-studio

# Proxy URL (REQUIRED)
VITE_FLOW_PROXY_URL=/api/chat/completions
```

#### Important Notes:

- **Supabase vars**: Required for authentication and database
- **Flow API vars**: Optional! Only needed if you want a fallback when users don't have their own credentials
- **VITE_FLOW_PROXY_URL**: Must be `/api/chat/completions` (not localhost)

---

### Step 5: Update Google OAuth Redirect URIs

**IMPORTANT**: Before deploying, update your Google OAuth configuration:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, add:
   ```
   https://your-project.supabase.co/auth/v1/callback
   https://your-netlify-site.netlify.app/auth/callback
   ```
5. Click **Save**

6. Go to [Supabase Dashboard](https://supabase.com/dashboard)
7. Navigate to **Authentication** → **URL Configuration**
8. Update **Site URL** to your Netlify URL:
   ```
   https://your-netlify-site.netlify.app
   ```
9. Add to **Redirect URLs**:
   ```
   https://your-netlify-site.netlify.app/auth/callback
   ```

---

### Step 6: Deploy!

1. Click "Trigger deploy" in Netlify
2. Wait for build to complete (~2-3 minutes)
3. ✅ Site is live!

---

## 🧪 Testing in Production

### Test 1: Login

1. Go to your Netlify URL
2. Click "Login with Google"
3. ✅ Should redirect to Google OAuth
4. ✅ Should redirect back and show dashboard

### Test 2: Save Credentials

1. Go to **Settings** → **AI Configuration**
2. Enter your Flow API credentials:
   - Client ID
   - Client Secret
   - Tenant: `lithiadw`
   - Agent: `mermaid-studio`
3. Click "Save Configuration"
4. ✅ Should show success message
5. ✅ Credentials encrypted in Supabase

### Test 3: Generate Diagram

1. Click **AI Assistant**
2. Type: "Create a user login workflow diagram"
3. Press Enter
4. ✅ Should generate diagram
5. ✅ Check browser Network tab → Headers should show:
   - `X-Flow-Client-Id`
   - `X-Flow-Client-Secret`
   - `X-Flow-Tenant`
   - `X-Flow-Agent`

### Test 4: Add Diagram

1. Click "Accept & Add Diagram"
2. ✅ Should save to Supabase
3. ✅ Should appear in diagram list immediately (no reload!)

---

## 🔒 Security in Production

### ✅ What's Secure:

1. **HTTPS Everywhere**:
   - Netlify provides free SSL
   - All traffic encrypted

2. **Credentials Encrypted**:
   - User credentials encrypted in database
   - Encryption key derived from user ID

3. **Server-Side Authentication**:
   - Netlify Function authenticates with Flow API
   - Client never sees Flow API directly

4. **Headers Encrypted**:
   - Headers sent over HTTPS
   - Only visible to your Netlify Function

### ⚠️ Production Best Practices:

1. **Remove Debug Logs**:
   - Remove `console.log` statements from production
   - Or use environment-based logging

2. **Monitor Function Logs**:
   - Check Netlify Function logs for errors
   - Set up error alerts

3. **Rate Limiting**:
   - Consider adding rate limiting to Netlify Function
   - Prevent abuse

---

## 📊 How It Works in Production

### With User Credentials:

```
User Browser
  ↓ (HTTPS)
  ↓ Headers: X-Flow-Client-Id, X-Flow-Client-Secret
  ↓
Netlify Function (/api/chat/completions)
  ↓ Extract credentials from headers
  ↓ Authenticate with Flow API
  ↓ Cache token per user
  ↓ Forward request to Flow API
  ↓
Flow API
  ↓ Process request
  ↓ Return response
  ↓
Netlify Function
  ↓ Return response to client
  ↓
User Browser
  ✅ Diagram generated!
```

### With Fallback Credentials (env vars):

```
User Browser
  ↓ (HTTPS)
  ↓ No credentials in headers
  ↓
Netlify Function
  ↓ Use FLOW_CLIENT_ID from env
  ↓ Authenticate with Flow API
  ↓ Cache token
  ↓ Forward request
  ↓
Flow API
  ↓ Process request
  ↓
User Browser
  ✅ Diagram generated!
```

---

## 🐛 Troubleshooting

### Issue: "Missing Flow API credentials"

**Cause**: No credentials in env variables AND no credentials in headers

**Solution**:
1. Add `FLOW_CLIENT_ID` and `FLOW_CLIENT_SECRET` to Netlify env vars (fallback)
2. OR ensure users save their credentials in Settings

---

### Issue: "CORS error"

**Cause**: CORS headers not configured

**Solution**:
- Check `netlify/functions/chat-completions.js`
- Ensure `Access-Control-Allow-Headers` includes custom headers
- Redeploy

---

### Issue: "Function timeout"

**Cause**: Flow API taking too long

**Solution**:
- Check Netlify Function logs
- Increase timeout in `netlify.toml`:
  ```toml
  [functions]
    timeout = 30
  ```

---

### Issue: Diagrams not appearing after adding

**Cause**: Frontend not reloading diagram list

**Solution**:
- Check browser console for errors
- Verify `setCurrentFolder` is being called
- Check ProjectPage useEffect dependencies

---

## 📝 Environment Variables Reference

### Frontend Variables (VITE_*)

```bash
# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx

# Proxy URL (IMPORTANT!)
VITE_FLOW_PROXY_URL=/api/chat/completions

# AI Provider (optional)
VITE_AI_PROVIDER=flow
VITE_AI_MODEL=gpt-4.1
VITE_AI_TEMPERATURE=0.7
VITE_AI_MAX_TOKENS=2000
```

### Backend Variables (Netlify Function)

```bash
# Flow API (optional fallback)
FLOW_CLIENT_ID=xxx
FLOW_CLIENT_SECRET=xxx
FLOW_TENANT=lithiadw
FLOW_AGENT=mermaid-studio
FLOW_APP_TO_ACCESS=llm-api
```

---

## 🎉 Deployment Complete!

Once deployed, your application will:
- ✅ Run on Netlify with HTTPS
- ✅ Use Supabase for authentication and database
- ✅ Support user-specific Flow API credentials
- ✅ Fall back to env credentials if user hasn't set their own
- ✅ Cache tokens per user for performance
- ✅ Provide seamless UX with no page reloads

---

## 🚀 Next Steps

1. Deploy to Netlify
2. Test all features
3. Share with team
4. Monitor Function logs
5. Optimize performance

**Your app is production-ready!** 🎉
