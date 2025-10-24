import { IAIProvider } from './AIProvider.interface';
import { FlowProvider } from './FlowProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { AIConfig, AIProvider as AIProviderType } from '../ai.types';

export class ProviderFactory {
  private static providers: Map<AIProviderType, IAIProvider> = new Map();
  
  static createProvider(config: AIConfig): IAIProvider {
    // ALWAYS create a new provider to ensure fresh config
    // Don't use cache because config can change (user preferences)
    console.log('🏭 ProviderFactory.createProvider called with provider:', config.provider);
    
    let provider: IAIProvider;
    
    switch (config.provider) {
      case 'flow':
        if (!config.flow) {
          throw new Error('Flow configuration is required');
        }
        console.log('🏭 Creating FlowProvider with config:', {
          hasClientId: !!config.flow.clientId,
          hasClientSecret: !!config.flow.clientSecret,
          clientIdLength: config.flow.clientId?.length || 0
        });
        provider = new FlowProvider(config.flow);
        break;
        
      case 'openai':
        if (!config.openai) {
          throw new Error('OpenAI configuration is required');
        }
        provider = new OpenAIProvider(config.openai);
        break;
        
      default:
        throw new Error(`Unsupported provider: ${config.provider}`);
    }
    
    // Cache the provider (but we'll always create new ones now)
    this.providers.set(config.provider, provider);
    return provider;
  }
  
  static clearCache(): void {
    this.providers.clear();
  }
}

export * from './AIProvider.interface';
export * from './FlowProvider';
export * from './OpenAIProvider';
