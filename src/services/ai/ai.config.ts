import { AIConfig } from './ai.types';

export const getAIConfig = (): AIConfig => {
  const provider = import.meta.env.VITE_AI_PROVIDER || 'flow';
  
  const baseConfig = {
    model: import.meta.env.VITE_AI_MODEL || 'gpt-4.1',
    temperature: parseFloat(import.meta.env.VITE_AI_TEMPERATURE || '0.7'),
    maxTokens: parseInt(import.meta.env.VITE_AI_MAX_TOKENS || '2000'),
    timeout: parseInt(import.meta.env.VITE_AI_TIMEOUT || '30000'),
  };
  
  if (provider === 'flow') {
    // Flow API credentials are handled by the proxy server (local) or Netlify Functions (production)
    // Frontend only needs to know it's using Flow provider
    return {
      ...baseConfig,
      provider: 'flow',
      flow: {
        // No credentials needed in frontend - proxy handles authentication
      },
    };
  }
  
  return {
    ...baseConfig,
    provider: 'openai',
    openai: {
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      apiUrl: import.meta.env.VITE_OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions',
    },
  };
};

export const AI_CONFIG = getAIConfig();
