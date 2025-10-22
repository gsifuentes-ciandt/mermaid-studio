# Proxy Server for Flow API

This proxy server handles CORS issues when calling the Flow API from the browser.

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# For development with auto-reload
npm run dev
```

The server will run on `http://localhost:3001`

## Endpoints

- `POST /api/chat/completions` - Proxy for Flow API chat completions
- `GET /health` - Health check endpoint

## Environment Variables

Set these in your environment or in the proxy.js file:

- `FLOW_CLIENT_ID` - Flow API client ID
- `FLOW_CLIENT_SECRET` - Flow API client secret
- `FLOW_APP_TO_ACCESS` - App to access (default: llm-api)
- `FLOW_TENANT` - Flow tenant (default: lithiadw)
- `FLOW_AGENT` - Flow agent (default: mermaid-studio)

## How It Works

1. Frontend makes request to `http://localhost:3001/api/chat/completions`
2. Proxy authenticates with Flow API
3. Proxy forwards request to Flow API with proper headers
4. Proxy returns response to frontend

This avoids CORS issues since the proxy runs on a server (Node.js) rather than in the browser.
