# 🧪 Flow API Testing Guide

This guide will help you troubleshoot the Flow API authentication issue using detailed logs and Postman.

---

## 📋 Table of Contents

1. [Using Enhanced Logs](#using-enhanced-logs)
2. [Testing with Postman](#testing-with-postman)
3. [Testing with cURL](#testing-with-curl)
4. [Interpreting Results](#interpreting-results)
5. [Common Issues](#common-issues)

---

## 🔍 Using Enhanced Logs

The proxy server now has **comprehensive logging** to help you debug issues.

### Start the Proxy Server

```bash
cd server
npm start
```

### What You'll See

When you make a request, you'll see detailed logs like this:

```
================================================================================
📨 [abc123] NEW CHAT COMPLETION REQUEST
================================================================================
⏰ Timestamp: 2025-10-18T21:30:00.000Z
📋 Request Body: {
  "model": "gpt-4.1",
  "messages": [...]
}
📋 Model: gpt-4.1
📋 Messages: 2 messages

🔐 Step 1: Authenticating...
📋 Auth URL: https://flow.ciandt.com/auth-engine-api/v1/api-key/token
📋 Client ID: 273432f1-faae-4789-b0b1-a70c110de55c
📋 App to Access: llm-api
📤 Sending auth request...
📥 Response status: 500 Internal Server Error
❌ Auth failed. Response: { "statusCode": 500, "message": "Internal server error" }
================================================================================
```

### Key Information in Logs

- **Request ID**: Unique identifier for each request
- **Timestamp**: When the request was made
- **Request Body**: Exact payload being sent
- **Auth Details**: Credentials being used
- **Response Status**: HTTP status code
- **Error Details**: Full error response from API

---

## 🚀 Testing with Postman

### Step 1: Import Collection

1. Open Postman
2. Click **Import**
3. Select `postman/Flow-API-Tests.postman_collection.json`
4. Collection will be imported with 4 pre-configured requests

### Step 2: Test Authentication (Direct)

**Request**: `1. Test Authentication (Direct)`

This tests the Flow API authentication endpoint directly.

**Expected Result**: ❌ Will fail with 500 error (current issue)

**What to Check**:
- Response status code
- Error message
- Activity ID (for support)

**Example Response**:
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "activityId": "c2ce75a4-5cca-4a5e-b095-3acd0e69a080"
}
```

### Step 3: Test Proxy Health Check

**Request**: `3. Health Check (Proxy)`

Make sure your proxy server is running.

**Expected Result**: ✅ Should succeed

```json
{
  "status": "ok",
  "timestamp": "2025-10-18T21:30:00.000Z"
}
```

### Step 4: Test Chat Completion (via Proxy)

**Request**: `2. Test Chat Completion (via Proxy)`

This tests the full flow through the proxy.

**Expected Result**: ❌ Will fail because authentication fails

**What to Check**:
- Check proxy server logs for detailed error
- Note the request ID
- Check error details

### Step 5: Test OpenAI (Alternative)

**Request**: `4. Test OpenAI (Direct)`

Test OpenAI as an alternative provider.

**Before running**:
1. Get OpenAI API key from https://platform.openai.com/api-keys
2. Update the `Authorization` header: `Bearer sk-your-key-here`

**Expected Result**: ✅ Should succeed (if you have valid API key)

---

## 💻 Testing with cURL

### Test 1: Flow API Authentication

```bash
curl -X POST https://flow.ciandt.com/auth-engine-api/v1/api-key/token \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "YOUR_FLOW_CLIENT_ID",
    "clientSecret": "YOUR_FLOW_CLIENT_SECRET",
    "appToAccess": "llm-api"
  }' \
  -v
```

**Note**: Replace `YOUR_FLOW_CLIENT_ID` and `YOUR_FLOW_CLIENT_SECRET` with your actual credentials from `.env.local`

**What to look for**:
- HTTP status code
- Response headers
- Error message
- Activity ID

### Test 2: Proxy Health Check

```bash
curl http://localhost:3001/health
```

**Expected**: `{"status":"ok","timestamp":"..."}`

### Test 3: Chat Completion via Proxy

```bash
curl -X POST http://localhost:3001/api/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4.1",
    "temperature": 0.7,
    "max_tokens": 2000,
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "Say hello!"
      }
    ]
  }' \
  -v
```

**Check proxy logs** for detailed error information.

---

## 📊 Interpreting Results

### Scenario 1: 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "activityId": "..."
}
```

**Meaning**: 
- Flow API is rejecting the request
- Credentials are likely invalid/expired
- OR API endpoint has changed

**Action**:
1. Contact Flow API team with the `activityId`
2. Request new credentials
3. Verify endpoint URL is correct

### Scenario 2: 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**Meaning**: 
- Credentials are definitely invalid
- Client ID or secret is wrong

**Action**:
1. Double-check credentials
2. Request new credentials

### Scenario 3: 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Forbidden"
}
```

**Meaning**: 
- Credentials are valid but don't have access
- Missing permissions for `llm-api`

**Action**:
1. Request access to `llm-api` app
2. Verify tenant and agent settings

### Scenario 4: 200 Success

```json
{
  "access_token": "eyJhbGc...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Meaning**: ✅ Authentication works!

**Action**:
- Credentials are valid
- Proxy should work now
- Test chat completion

---

## 🔧 Common Issues

### Issue 1: Proxy Not Running

**Error**: `Failed to fetch` or `ECONNREFUSED`

**Solution**:
```bash
cd server
npm start
```

### Issue 2: Wrong Proxy URL

**Error**: 404 Not Found

**Check**: `.env.local` should have:
```bash
VITE_FLOW_PROXY_URL=http://localhost:3001/api/chat/completions
```

### Issue 3: Credentials in Wrong Format

**Try different formats**:

Format 1 (Current):
```json
{
  "clientId": "...",
  "clientSecret": "...",
  "appToAccess": "llm-api"
}
```

Format 2 (Snake Case):
```json
{
  "client_id": "...",
  "client_secret": "...",
  "app_to_access": "llm-api"
}
```

### Issue 4: Expired Credentials

**Symptoms**: 500 or 401 errors

**Solution**: Request fresh credentials from Flow API team

---

## 📝 Debugging Checklist

When troubleshooting, collect this information:

- [ ] Proxy server logs (full output)
- [ ] HTTP status code from Flow API
- [ ] Activity ID from error response
- [ ] Request timestamp
- [ ] Credentials being used (client ID only, not secret!)
- [ ] Endpoint URLs
- [ ] Tenant and agent values

---

## 🎯 Quick Tests

### Test 1: Is Proxy Running?

```bash
curl http://localhost:3001/health
```

✅ Should return: `{"status":"ok"}`

### Test 2: Can Proxy Reach Flow API?

```bash
# Check proxy logs when making this request
curl -X POST http://localhost:3001/api/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4.1","messages":[{"role":"user","content":"test"}]}'
```

✅ Check logs for detailed error

### Test 3: Does OpenAI Work?

Update `.env.local`:
```bash
VITE_AI_PROVIDER=openai
VITE_OPENAI_API_KEY=sk-your-key-here
```

Restart frontend and test.

---

## 📞 Getting Help

### Information to Provide

When contacting Flow API support, include:

1. **Activity ID** from error response
2. **Timestamp** of the error
3. **Client ID** (not the secret!)
4. **Endpoint URL** you're calling
5. **Full error response**
6. **Proxy server logs**

### Example Support Request

```
Subject: Flow API Authentication Failing with 500 Error

Hi Flow API Team,

I'm getting a 500 Internal Server Error when trying to authenticate.

Details:
- Activity ID: c2ce75a4-5cca-4a5e-b095-3acd0e69a080
- Timestamp: 2025-10-18T21:30:00.000Z
- Client ID: 273432f1-faae-4789-b0b1-a70c110de55c
- Endpoint: https://flow.ciandt.com/auth-engine-api/v1/api-key/token
- App to Access: llm-api

Error Response:
{
  "statusCode": 500,
  "message": "Internal server error",
  "activityId": "c2ce75a4-5cca-4a5e-b095-3acd0e69a080"
}

Could you please verify if my credentials are still valid?

Thanks!
```

---

## ✅ Success Criteria

You'll know it's working when:

1. **Authentication succeeds**:
   ```
   ✅ Successfully authenticated with Flow API
   ```

2. **Token is obtained**:
   ```
   ✅ Auth response received: { hasToken: true, expiresIn: 3600 }
   ```

3. **Chat completion works**:
   ```
   ✅ Success! Response received
   📊 Response preview: { id: '...', model: 'gpt-4.1', choices: 1 }
   ```

4. **Frontend works**: Press `Cmd+K` / `Ctrl+K` and generate diagrams!

---

## 🔄 Alternative: Use OpenAI

If Flow API continues to fail, switch to OpenAI:

1. Get API key: https://platform.openai.com/api-keys
2. Update `.env.local`:
   ```bash
   VITE_AI_PROVIDER=openai
   VITE_OPENAI_API_KEY=sk-your-key-here
   ```
3. Restart frontend (no proxy needed!)
4. Test immediately!

---

**Happy Testing!** 🧪✨
