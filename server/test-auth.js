/**
 * Test script to verify Flow API authentication
 * Run with: node test-auth.js
 * 
 * Required environment variables:
 * - FLOW_CLIENT_ID
 * - FLOW_CLIENT_SECRET
 */

require('dotenv').config({ path: '../.env.local' });
const fetch = require('node-fetch');

const FLOW_CONFIG = {
  authUrl: 'https://flow.ciandt.com/auth-engine-api/v1/api-key/token',
  clientId: process.env.FLOW_CLIENT_ID,
  clientSecret: process.env.FLOW_CLIENT_SECRET,
  appToAccess: 'llm-api',
};

// Validate required environment variables
if (!FLOW_CONFIG.clientId || !FLOW_CONFIG.clientSecret) {
  console.error('❌ ERROR: FLOW_CLIENT_ID and FLOW_CLIENT_SECRET environment variables are required');
  console.error('   Make sure you have a .env.local file in the project root with these variables set');
  process.exit(1);
}

async function testAuth() {
  console.log('🧪 Testing Flow API Authentication...\n');
  console.log('📋 Configuration:');
  console.log('   Auth URL:', FLOW_CONFIG.authUrl);
  console.log('   Client ID:', FLOW_CONFIG.clientId);
  console.log('   App to Access:', FLOW_CONFIG.appToAccess);
  console.log('   Client Secret:', FLOW_CONFIG.clientSecret.substring(0, 10) + '...\n');

  const payload = {
    clientId: FLOW_CONFIG.clientId,
    clientSecret: FLOW_CONFIG.clientSecret,
    appToAccess: FLOW_CONFIG.appToAccess,
  };

  console.log('📤 Sending POST request...');
  console.log('📦 Payload:', JSON.stringify(payload, null, 2), '\n');

  try {
    const headers = {
      'Content-Type': 'application/json',
      'FlowTenant': 'lithiadw',
    };
    
    console.log('📋 Headers:', JSON.stringify(headers, null, 2), '\n');
    
    const response = await fetch(FLOW_CONFIG.authUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });

    console.log('📥 Response Status:', response.status, response.statusText);
    console.log('📥 Response Headers:', Object.fromEntries(response.headers.entries()), '\n');

    const responseText = await response.text();
    console.log('📥 Response Body:', responseText, '\n');

    if (!response.ok) {
      console.error('❌ Authentication FAILED');
      console.error('   Status:', response.status);
      console.error('   Body:', responseText);
      process.exit(1);
    }

    const data = JSON.parse(responseText);
    console.log('✅ Authentication SUCCESSFUL!');
    console.log('   Token:', data.access_token ? data.access_token.substring(0, 20) + '...' : 'NOT FOUND');
    console.log('   Expires In:', data.expires_in, 'seconds');
    console.log('   Token Type:', data.token_type);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('   Stack:', error.stack);
    process.exit(1);
  }
}

testAuth();
