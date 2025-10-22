import { DiagramType } from '../../types/diagram.types';

// Provider Types
export type AIProvider = 'flow' | 'openai' | 'claude';

// Configuration
export interface AIConfig {
  provider: AIProvider;
  model: string;
  temperature: number;
  maxTokens: number;
  timeout: number;
  flow?: FlowConfig;
  openai?: OpenAIConfig;
}

export interface FlowConfig {
  // These fields are not used in the frontend
  // Authentication is handled by the proxy server (local) or Netlify Functions (production)
  authUrl?: string;
  apiUrl?: string;
  clientId?: string;
  clientSecret?: string;
  appToAccess?: string;
  tenant?: string;
  agent?: string;
}

export interface OpenAIConfig {
  apiKey: string;
  apiUrl: string;
}

// Messages
export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatMessage extends AIMessage {
  id: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Requests
export interface ChatCompletionRequest {
  model: string;
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  signal?: AbortSignal;
}

// Responses
export interface ChatCompletionResponse {
  id: string;
  model: string;
  choices: {
    index: number;
    message: AIMessage;
    finishReason: string;
  }[];
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: AIError;
  metadata?: {
    provider: AIProvider;
    model: string;
    tokensUsed?: number;
    latency?: number;
  };
}

export interface AIError {
  code: string;
  message: string;
  recoverable: boolean;
  originalError?: any;
}

// Diagram Generation
export interface DiagramGenerationRequest {
  prompt: string;
  type: DiagramType;
  context?: string;
}

export interface DiagramGenerationResponse {
  code: string;
  explanation?: string;
  title?: string;
  description?: string;
  tags?: string[];
  type?: DiagramType;
  // Endpoint-specific fields
  httpMethod?: string;
  endpointPath?: string;
  requestPayloads?: Array<{
    status: string;
    contentType: string;
    json: string;
  }>;
  responsePayloads?: Array<{
    status: string;
    contentType: string;
    json: string;
  }>;
  // Workflow-specific fields
  workflowActors?: string;
  workflowTrigger?: string;
}

export interface DiagramModificationRequest {
  code: string;
  instruction: string;
  type: DiagramType;
}

export interface DiagramModificationResponse {
  originalCode: string;
  modifiedCode: string;
  explanation: string;
  changes: string[];
}

// Suggestions
export interface Suggestion {
  id: string;
  type: 'generate' | 'modify' | 'improve' | 'explain';
  originalCode?: string;
  suggestedCode?: string;
  explanation: string;
  confidence: number;
  metadata?: Record<string, any>;
}

// AI Settings
export interface AISettings {
  provider: AIProvider;
  model: string;
  temperature: number;
  maxTokens: number;
  enableAutoSuggestions: boolean;
  enableExplanations: boolean;
}
