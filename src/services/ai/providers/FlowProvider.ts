import { BaseAIProvider } from './AIProvider.interface';
import {
  ChatCompletionRequest,
  ChatCompletionResponse,
  FlowConfig,
  AIError,
} from '../ai.types';

export class FlowProvider extends BaseAIProvider {
  readonly name = 'flow';
  
  constructor(private config: FlowConfig) {
    super();
  }
  
  async authenticate(): Promise<string> {
    // For Flow API, authentication is handled by the proxy server
    // Return a placeholder token
    return 'proxy-handled';
  }
  
  async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    try {
      console.log('🌊 FlowProvider.chatCompletion called');
      console.log('📦 FlowProvider config:', {
        hasClientId: !!this.config.clientId,
        hasClientSecret: !!this.config.clientSecret,
        hasTenant: !!this.config.tenant,
        hasAgent: !!this.config.agent,
        clientIdLength: this.config.clientId?.length || 0,
        clientSecretLength: this.config.clientSecret?.length || 0,
      });
      
      // Use proxy server (local) or Netlify Function (production)
      // In production, VITE_FLOW_PROXY_URL should be set to '/api/chat/completions'
      // In development, it defaults to 'http://localhost:3001/api/chat/completions'
      const proxyUrl = import.meta.env.VITE_FLOW_PROXY_URL || 
                       (import.meta.env.PROD ? '/api/chat/completions' : 'http://localhost:3001/api/chat/completions');
      
      // Build headers - include user credentials if available
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add Flow credentials from config if available (from user preferences)
      if (this.config.clientId) {
        headers['X-Flow-Client-Id'] = this.config.clientId;
        console.log('✅ Added X-Flow-Client-Id header');
      } else {
        console.log('⚠️ No clientId in config');
      }
      if (this.config.clientSecret) {
        headers['X-Flow-Client-Secret'] = this.config.clientSecret;
        console.log('✅ Added X-Flow-Client-Secret header');
      } else {
        console.log('⚠️ No clientSecret in config');
      }
      if (this.config.tenant) {
        headers['X-Flow-Tenant'] = this.config.tenant;
        console.log('✅ Added X-Flow-Tenant header');
      }
      if (this.config.agent) {
        headers['X-Flow-Agent'] = this.config.agent;
        console.log('✅ Added X-Flow-Agent header');
      }
      
      console.log('📤 Sending request to proxy with headers:', Object.keys(headers));
      
      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: request.model,
          temperature: request.temperature,
          max_tokens: request.maxTokens,
          messages: request.messages,
          stream: request.stream || false,
        }),
        signal: request.signal, // Pass abort signal to fetch
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || response.statusText);
      }
      
      const data = await response.json();
      
      return {
        id: data.id,
        model: data.model,
        choices: data.choices.map((choice: any) => ({
          index: choice.index,
          message: {
            role: choice.message.role,
            content: choice.message.content,
          },
          finishReason: choice.finish_reason,
        })),
        usage: data.usage ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        } : undefined,
      };
    } catch (error: any) {
      // Enhanced error handling for connection issues
      console.error('🔴 FlowProvider error:', error);
      console.error('🔴 Error name:', error.name);
      console.error('🔴 Error message:', error.message);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        // Network error - likely proxy server not running
        console.error('🔴 Detected fetch error - proxy not running');
        throw this.handleError(new Error('net::ERR_CONNECTION_REFUSED - Proxy server not running'));
      }
      throw this.handleError(error);
    }
  }
  
  handleError(error: any): AIError {
    let message = error.message || 'Flow API error';
    
    // Enhance error messages for common issues
    if (message.includes('Failed to fetch')) {
      message = 'net::ERR_CONNECTION_REFUSED - Cannot connect to proxy server';
    } else if (error.name === 'TypeError' && !message.includes('ERR_CONNECTION')) {
      message = `Network error: ${message}`;
    }
    
    // Determine if error is recoverable
    const recoverable = 
      message.includes('timeout') ||
      message.includes('rate limit') ||
      message.includes('503') ||
      message.includes('502');
    
    return {
      code: error.code || 'FLOW_ERROR',
      message,
      recoverable,
      originalError: error,
    };
  }
}
