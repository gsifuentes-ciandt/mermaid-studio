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
// Key: clientId + tenant, Value: { token, expiry }
const tokenCache = new Map();

/**
 * Authenticate with Flow API and get access token
 * Supports credentials from env variables OR request headers (user preferences)
 */
async function authenticate(clientId, clientSecret, tenant) {
  // Use provided credentials or fall back to env variables
  const authClientId = clientId || FLOW_CONFIG.clientId;
  const authClientSecret = clientSecret || FLOW_CONFIG.clientSecret;
  const authTenant = tenant || FLOW_CONFIG.tenant;
  
  if (!authClientId || !authClientSecret) {
    throw new Error('Missing Flow API credentials. Provide via env variables or request headers.');
  }
  
  // Create cache key based on clientId + tenant
  const cacheKey = `${authClientId}:${authTenant}`;
  
  // Return cached token if still valid (with 5 minute buffer)
  const cached = tokenCache.get(cacheKey);
  if (cached && cached.expiry && new Date() < new Date(cached.expiry.getTime() - 5 * 60 * 1000)) {
    console.log('Using cached token for:', cacheKey.substring(0, 20) + '...');
    return cached.token;
  }

  console.log('Authenticating with Flow API...');
  console.log('Client ID:', authClientId ? authClientId.substring(0, 10) + '...' : 'N/A');
  console.log('Tenant:', authTenant);
  
  const payload = {
    clientId: authClientId,
    clientSecret: authClientSecret,
    appToAccess: FLOW_CONFIG.appToAccess,
  };

  const response = await fetch(FLOW_CONFIG.authUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'FlowTenant': authTenant,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Authentication failed:', response.status, errorText);
    throw new Error(`Flow API authentication failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const token = data.access_token;
  
  // Calculate token expiry (expires_in is in seconds)
  const expiresInMs = (data.expires_in || 3600) * 1000;
  const expiry = new Date(Date.now() + expiresInMs);
  
  // Cache token
  tokenCache.set(cacheKey, { token, expiry });
  
  console.log('Authentication successful, token expires at:', expiry.toISOString());
  
  return token;
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
        'Access-Control-Allow-Headers': 'Content-Type, X-Flow-Client-Id, X-Flow-Client-Secret, X-Flow-Tenant, X-Flow-Agent',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
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

    // Extract credentials from request headers (user preferences)
    const headerClientId = event.headers['x-flow-client-id'];
    const headerClientSecret = event.headers['x-flow-client-secret'];
    const headerTenant = event.headers['x-flow-tenant'];
    const headerAgent = event.headers['x-flow-agent'];
    
    if (headerClientId && headerClientSecret) {
      console.log('Using credentials from request headers (user preferences)');
    } else if (FLOW_CONFIG.clientId && FLOW_CONFIG.clientSecret) {
      console.log('Using credentials from environment variables');
    } else {
      console.error('No credentials available');
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

    // Get authentication token (with user credentials or env credentials)
    const token = await authenticate(
      headerClientId,
      headerClientSecret,
      headerTenant
    );

    // Forward request to Flow API
    const response = await fetch(FLOW_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'FlowTenant': headerTenant || FLOW_CONFIG.tenant,
        'FlowAgent': headerAgent || FLOW_CONFIG.agent,
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
