import { BaseAIProvider } from './AIProvider.interface';
import {
  ChatCompletionRequest,
  ChatCompletionResponse,
  OpenAIConfig,
  AIError,
} from '../ai.types';

export class OpenAIProvider extends BaseAIProvider {
  readonly name = 'openai';
  
  constructor(private config: OpenAIConfig) {
    super();
  }
  
  async authenticate(): Promise<null> {
    // OpenAI uses API key, no separate auth needed
    return null;
  }
  
  async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    try {
      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
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
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  handleError(error: any): AIError {
    const message = error.message || 'OpenAI API error';
    
    const recoverable = 
      message.includes('timeout') ||
      message.includes('rate_limit') ||
      message.includes('overloaded');
    
    return {
      code: error.code || 'OPENAI_ERROR',
      message,
      recoverable,
      originalError: error,
    };
  }
}
