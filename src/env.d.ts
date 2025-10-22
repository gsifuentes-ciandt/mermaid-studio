/// <reference types="vite/client" />

interface ImportMetaEnv {
  // AI Provider
  readonly VITE_AI_PROVIDER: 'flow' | 'openai';
  readonly VITE_AI_FALLBACK_PROVIDER: 'flow' | 'openai';
  
  // Flow API
  readonly VITE_FLOW_AUTH_URL: string;
  readonly VITE_FLOW_API_URL: string;
  readonly VITE_FLOW_CLIENT_ID: string;
  readonly VITE_FLOW_CLIENT_SECRET: string;
  readonly VITE_FLOW_APP_TO_ACCESS: string;
  readonly VITE_FLOW_TENANT: string;
  readonly VITE_FLOW_AGENT: string;
  
  // OpenAI
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_OPENAI_API_URL: string;
  
  // AI Settings
  readonly VITE_AI_MODEL: string;
  readonly VITE_AI_TEMPERATURE: string;
  readonly VITE_AI_MAX_TOKENS: string;
  readonly VITE_AI_TIMEOUT: string;
  
  // Feature Flags
  readonly VITE_AI_ENABLED: string;
  readonly VITE_AI_STREAMING: string;
  readonly VITE_AI_CACHE_ENABLED: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
