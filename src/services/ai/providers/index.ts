import { IAIProvider } from './AIProvider.interface';
import { FlowProvider } from './FlowProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { AIConfig, AIProvider as AIProviderType } from '../ai.types';

export class ProviderFactory {
  private static providers: Map<AIProviderType, IAIProvider> = new Map();
  
  static createProvider(config: AIConfig): IAIProvider {
    // Return cached provider if exists
    if (this.providers.has(config.provider)) {
      return this.providers.get(config.provider)!;
    }
    
    let provider: IAIProvider;
    
    switch (config.provider) {
      case 'flow':
        if (!config.flow) {
          throw new Error('Flow configuration is required');
        }
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
