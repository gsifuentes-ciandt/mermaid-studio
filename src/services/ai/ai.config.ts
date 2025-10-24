import { AIConfig } from './ai.types';
import { supabase, isSupabaseConfigured } from '../supabase';
import { decryptData } from '../../utils/encryption';
import { logger } from '../../utils/logger';

export const getAIConfig = (): AIConfig => {
  const provider = import.meta.env.VITE_AI_PROVIDER || 'flow';
  
  const baseConfig = {
    model: import.meta.env.VITE_AI_MODEL || 'gpt-4.1',
    temperature: parseFloat(import.meta.env.VITE_AI_TEMPERATURE || '0.7'),
    maxTokens: parseInt(import.meta.env.VITE_AI_MAX_TOKENS || '2000'),
    timeout: parseInt(import.meta.env.VITE_AI_TIMEOUT || '30000'),
  };
  
  if (provider === 'flow') {
    // Flow API credentials from env (will be overridden by user preferences if available)
    return {
      ...baseConfig,
      provider: 'flow',
      flow: {
        apiUrl: import.meta.env.VITE_FLOW_API_URL || 'https://flow.ciandt.com',
        clientId: import.meta.env.VITE_FLOW_CLIENT_ID || '',
        clientSecret: import.meta.env.VITE_FLOW_CLIENT_SECRET || '',
        tenant: import.meta.env.VITE_FLOW_TENANT || 'lithiadw',
        agent: import.meta.env.VITE_FLOW_AGENT || 'mermaid-studio',
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

/**
 * Gets AI config with user preferences from Supabase (if available)
 */
export async function getAIConfigWithUserPreferences(userId?: string): Promise<AIConfig> {
  const baseConfig = getAIConfig();
  
  logger.log('🔧 getAIConfigWithUserPreferences called with userId:', userId);
  
  // If no Supabase or no user, return base config
  if (!isSupabaseConfigured() || !userId) {
    logger.log('⚠️ No Supabase or no userId, returning base config');
    return baseConfig;
  }
  
  try {
    logger.log('📡 Fetching user preferences from Supabase...');
    // Fetch user preferences from Supabase
    const { data, error } = await supabase
      .from('user_preferences')
      .select('ai_provider, ai_credentials')
      .eq('user_id', userId)
      .single();
    
    if (error || !data) {
      logger.log('⚠️ No user preferences found, using base config. Error:', error);
      return baseConfig;
    }
    
    logger.log('✅ User preferences found:', { hasProvider: !!data.ai_provider, hasCredentials: !!data.ai_credentials });
    
    // Override provider if set
    const provider = data.ai_provider || baseConfig.provider;
    
    // Decrypt credentials if available
    if (data.ai_credentials && typeof data.ai_credentials === 'string') {
      try {
        const credentials = await decryptData(data.ai_credentials, userId);
        logger.log('🔓 Credentials decrypted:', { hasFlow: !!credentials.flow, hasOpenAI: !!credentials.openai });
        
        if (provider === 'flow' && credentials.flow) {
          logger.log('✅ Using Flow credentials from user preferences');
          return {
            ...baseConfig,
            provider: 'flow',
            flow: {
              apiUrl: credentials.flow.apiUrl || baseConfig.flow?.apiUrl || 'https://flow.ciandt.com',
              clientId: credentials.flow.clientId || baseConfig.flow?.clientId || '',
              clientSecret: credentials.flow.clientSecret || baseConfig.flow?.clientSecret || '',
              tenant: credentials.flow.tenant || baseConfig.flow?.tenant || 'lithiadw',
              agent: credentials.flow.agent || baseConfig.flow?.agent || 'mermaid-studio',
            },
          };
        }
        
        if (provider === 'openai' && credentials.openai) {
          return {
            ...baseConfig,
            provider: 'openai',
            openai: {
              apiKey: credentials.openai.apiKey || baseConfig.openai?.apiKey || '',
              apiUrl: baseConfig.openai?.apiUrl || 'https://api.openai.com/v1/chat/completions',
            },
          };
        }
      } catch (decryptError) {
        console.error('Failed to decrypt credentials:', decryptError);
      }
    }
    
    return baseConfig;
  } catch (err) {
    console.error('Error loading user preferences:', err);
    return baseConfig;
  }
}

export const AI_CONFIG = getAIConfig();
