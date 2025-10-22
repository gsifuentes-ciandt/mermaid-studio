/**
 * Netlify Function: Flow API Chat Completions Proxy
 * 
 * This function acts as a proxy between the frontend and Flow API
 * to keep credentials secure on the server side.
 * 
 * Environment variables required:
 * - FLOW_CLIENT_ID
 * - FLOW_CLIENT_SECRET
 * - FLOW_APP_TO_ACCESS (default: llm-api)
 * - FLOW_TENANT (default: lithiadw)
 * - FLOW_AGENT (default: mermaid-studio)
 */

const fetch = require('node-fetch');

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

// Token cache (persists across function invocations in the same container)
let cachedToken = null;
let tokenExpiry = null;

/**
 * Authenticate with Flow API and get access token
 */
async function authenticate() {
  // Return cached token if still valid (with 5 minute buffer)
  if (cachedToken && tokenExpiry && new Date() < new Date(tokenExpiry.getTime() - 5 * 60 * 1000)) {
    console.log('Using cached token');
    return cachedToken;
  }

  console.log('Authenticating with Flow API...');
  
  const payload = {
    clientId: FLOW_CONFIG.clientId,
    clientSecret: FLOW_CONFIG.clientSecret,
    appToAccess: FLOW_CONFIG.appToAccess,
  };

  const response = await fetch(FLOW_CONFIG.authUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'FlowTenant': FLOW_CONFIG.tenant,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Authentication failed:', response.status, errorText);
    throw new Error(`Flow API authentication failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  
  // Calculate token expiry (expires_in is in seconds)
  const expiresInMs = (data.expires_in || 3600) * 1000;
  tokenExpiry = new Date(Date.now() + expiresInMs);
  
  console.log('Authentication successful, token expires at:', tokenExpiry.toISOString());
  
  return cachedToken;
}

/**
 * Netlify Function Handler
 */
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  // Validate required environment variables
  if (!FLOW_CONFIG.clientId || !FLOW_CONFIG.clientSecret) {
    console.error('Missing required environment variables');
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Server configuration error: Missing Flow API credentials' 
      }),
    };
  }

  try {
    // Parse request body
    const requestBody = JSON.parse(event.body);
    
    console.log('Chat completion request:', {
      model: requestBody.model,
      messageCount: requestBody.messages?.length,
      temperature: requestBody.temperature,
    });

    // Get authentication token
    const token = await authenticate();

    // Forward request to Flow API
    const response = await fetch(FLOW_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'FlowTenant': FLOW_CONFIG.tenant,
        'FlowAgent': FLOW_CONFIG.agent,
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Flow API error:', response.status, responseData);
      return {
        statusCode: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(responseData),
      };
    }

    console.log('Chat completion successful');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(responseData),
    };

  } catch (error) {
    console.error('Error in chat completion:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: {
          message: error.message || 'Internal server error',
          type: 'server_error',
        },
      }),
    };
  }
};
