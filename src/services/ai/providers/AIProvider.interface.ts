import {
  ChatCompletionRequest,
  ChatCompletionResponse,
  AIError,
} from '../ai.types';

export interface IAIProvider {
  /**
   * Provider identifier
   */
  readonly name: string;
  
  /**
   * Authenticate with the provider (if needed)
   * Returns access token or null if no auth required
   */
  authenticate(): Promise<string | null>;
  
  /**
   * Send chat completion request
   */
  chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse>;
  
  /**
   * Check if provider is available
   */
  isAvailable(): Promise<boolean>;
  
  /**
   * Handle provider-specific errors
   */
  handleError(error: any): AIError;
}

export abstract class BaseAIProvider implements IAIProvider {
  abstract readonly name: string;
  
  protected accessToken: string | null = null;
  protected tokenExpiry: Date | null = null;
  
  abstract authenticate(): Promise<string | null>;
  abstract chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse>;
  
  async isAvailable(): Promise<boolean> {
    try {
      await this.authenticate();
      return true;
    } catch {
      return false;
    }
  }
  
  handleError(error: any): AIError {
    // Default error handling
    return {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      recoverable: false,
      originalError: error,
    };
  }
  
  protected isTokenExpired(): boolean {
    if (!this.tokenExpiry) return true;
    return new Date() >= this.tokenExpiry;
  }
}
