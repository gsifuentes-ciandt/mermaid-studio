/**
 * Simple proxy server for Flow API to handle CORS
 * Run with: node server/proxy.js
 * 
 * Requires .env.local file in project root with:
 * - FLOW_CLIENT_ID
 * - FLOW_CLIENT_SECRET
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '../.env.local' });

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

// Enable CORS for your frontend
app.use(cors({
  origin: ['http://localhost:5173', 'https://mermaid-studio.netlify.app'],
  credentials: true
}));

app.use(express.json());

// Flow API configuration
const FLOW_CONFIG = {
  authUrl: 'https://flow.ciandt.com/auth-engine-api/v1/api-key/token',
  apiUrl: 'https://flow.ciandt.com/ai-orchestration-api/v1/openai/chat/completions',
  clientId: process.env.FLOW_CLIENT_ID,
  clientSecret: process.env.FLOW_CLIENT_SECRET,
  appToAccess: process.env.FLOW_APP_TO_ACCESS || 'llm-api',
  tenant: process.env.FLOW_TENANT || 'lithiadw',
  agent: process.env.FLOW_AGENT || 'mermaid-studio'
};

// Validate required environment variables
if (!FLOW_CONFIG.clientId || !FLOW_CONFIG.clientSecret) {
  console.error('ERROR: FLOW_CLIENT_ID and FLOW_CLIENT_SECRET environment variables are required');
  process.exit(1);
}

let cachedToken = null;
let tokenExpiry = null;

// Authenticate with Flow API
async function authenticate() {
  // Return cached token if still valid
  if (cachedToken && tokenExpiry && new Date() < tokenExpiry) {
    return cachedToken;
  }

  try {
    console.log('🔐 Attempting authentication with Flow API...');
    console.log('📋 Auth URL:', FLOW_CONFIG.authUrl);
    console.log('📋 Client ID:', FLOW_CONFIG.clientId);
    console.log('📋 App to Access:', FLOW_CONFIG.appToAccess);
    
    const authPayload = {
      clientId: FLOW_CONFIG.clientId,
      clientSecret: FLOW_CONFIG.clientSecret,
      appToAccess: FLOW_CONFIG.appToAccess,
    };
    
    console.log('📤 Sending auth request...');
    
    const authHeaders = {
      'Content-Type': 'application/json',
      'FlowTenant': FLOW_CONFIG.tenant,
    };
    
    console.log('📋 Auth Headers:', JSON.stringify(authHeaders, null, 2));
    
    const response = await fetch(FLOW_CONFIG.authUrl, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(authPayload),
    });

    console.log('📥 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Auth failed. Response:', errorText);
      console.error('❌ Status:', response.status);
      console.error('❌ Headers:', Object.fromEntries(response.headers.entries()));
      throw new Error(`Authentication failed: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Auth response received:', { hasToken: !!data.access_token, expiresIn: data.expires_in });
    cachedToken = data.access_token;

    // Set token expiry (default 1 hour, minus 5 minutes buffer)
    const expiresIn = (data.expires_in || 3600) - 300;
    tokenExpiry = new Date(Date.now() + expiresIn * 1000);

    console.log('✅ Successfully authenticated with Flow API');
    return cachedToken;
  } catch (error) {
    console.error('❌ Authentication error:', error.message);
    throw error;
  }
}

// Proxy endpoint for chat completions
app.post('/api/chat/completions', async (req, res) => {
  const requestId = Date.now().toString(36);
  
  try {
    console.log('\n' + '='.repeat(80));
    console.log(`📨 [${requestId}] NEW CHAT COMPLETION REQUEST`);
    console.log('='.repeat(80));
    console.log('⏰ Timestamp:', new Date().toISOString());
    console.log('📋 Request Body:', JSON.stringify(req.body, null, 2));
    console.log('📋 Model:', req.body.model);
    console.log('📋 Messages:', req.body.messages?.length || 0, 'messages');
    
    console.log('\n🔐 Step 1: Authenticating...');
    const token = await authenticate();
    console.log('✅ Authentication successful, token obtained');
    
    console.log('\n📤 Step 2: Sending request to Flow API...');
    console.log('🌐 URL:', FLOW_CONFIG.apiUrl);
    console.log('🏢 Tenant:', FLOW_CONFIG.tenant);
    console.log('🤖 Agent:', FLOW_CONFIG.agent);
    
    const requestHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'FlowTenant': FLOW_CONFIG.tenant,
      'FlowAgent': FLOW_CONFIG.agent,
    };
    
    console.log('📋 Request Headers:', JSON.stringify(requestHeaders, null, 2));
    
    const response = await fetch(FLOW_CONFIG.apiUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(req.body),
    });

    console.log('\n📥 Step 3: Received response from Flow API');
    console.log('📊 Status:', response.status, response.statusText);
    console.log('📋 Response Headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { raw: errorText };
      }
      
      console.error('\n❌ Flow API Error Response:');
      console.error('   Status:', response.status);
      console.error('   Status Text:', response.statusText);
      console.error('   Error Data:', JSON.stringify(errorData, null, 2));
      console.error('='.repeat(80) + '\n');
      
      return res.status(response.status).json({
        error: {
          message: errorData.error?.message || errorData.message || response.statusText,
          code: 'FLOW_API_ERROR',
          details: errorData,
          requestId
        }
      });
    }

    const data = await response.json();
    console.log('\n✅ Success! Response received');
    console.log('📊 Response preview:', {
      id: data.id,
      model: data.model,
      choices: data.choices?.length || 0,
      usage: data.usage
    });
    
    // Log the actual content for debugging
    if (data.choices && data.choices[0]?.message?.content) {
      const content = data.choices[0].message.content;
      console.log('\n📝 Response Content:');
      console.log('─'.repeat(80));
      console.log(content.substring(0, 500) + (content.length > 500 ? '...' : ''));
      console.log('─'.repeat(80));
      console.log('📏 Content length:', content.length, 'characters');
      console.log('🔚 Finish reason:', data.choices[0].finish_reason);
    }
    
    console.log('='.repeat(80) + '\n');
    
    res.json(data);
  } catch (error) {
    console.error('\n❌ PROXY ERROR:');
    console.error('   Message:', error.message);
    console.error('   Stack:', error.stack);
    console.error('='.repeat(80) + '\n');
    
    res.status(500).json({
      error: {
        message: error.message,
        code: 'PROXY_ERROR',
        requestId
      }
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Proxying requests to Flow API`);
  console.log(`🔐 Using tenant: ${FLOW_CONFIG.tenant}`);
  console.log(`🤖 Using agent: ${FLOW_CONFIG.agent}`);
});
