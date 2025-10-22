import { IAIProvider } from './providers';
import { ProviderFactory } from './providers';
import { AI_CONFIG } from './ai.config';
import {
  AIResponse,
  DiagramGenerationRequest,
  DiagramGenerationResponse,
  DiagramModificationRequest,
  DiagramModificationResponse,
} from './ai.types';
import { SYSTEM_PROMPTS } from './prompts';
import { INTENT_ANALYSIS_PROMPT } from './prompts/intent-analysis-prompt';
import { 
  validateMermaidSyntax, 
  extractMermaidCode, 
  extractExplanation, 
  extractTitle, 
  extractDescription,
  extractHttpMethod,
  extractEndpointPath,
  extractRequestPayloads,
  extractResponsePayloads,
  extractWorkflowActors,
  extractWorkflowTrigger,
  extractDiagramType
} from './ai.utils';
import { errorTrackingService } from '../errorTracking.service';

export class AIService {
  private provider: IAIProvider;
  private fallbackProvider?: IAIProvider;
  
  constructor() {
    this.provider = ProviderFactory.createProvider(AI_CONFIG);
    
    // Set up fallback provider if configured
    const fallbackProviderType = import.meta.env.VITE_AI_FALLBACK_PROVIDER;
    if (fallbackProviderType && fallbackProviderType !== AI_CONFIG.provider) {
      // Note: Fallback would need full config - simplified for MVP
      console.log('Fallback provider configured:', fallbackProviderType);
    }
  }
  
  async generateDiagram(
    request: DiagramGenerationRequest,
    signal?: AbortSignal
  ): Promise<AIResponse<DiagramGenerationResponse>> {
    const startTime = Date.now();
    
    try {
      const systemPrompt = SYSTEM_PROMPTS.generate[request.type] || SYSTEM_PROMPTS.generate.base;
      
      // Build messages array with context if provided
      const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
        { role: 'system', content: systemPrompt },
      ];
      
      // Add conversation context if provided
      if (request.context) {
        messages.push({
          role: 'system',
          content: `Previous conversation:\n${request.context}\n\nUse this context to understand the user's request better.`,
        });
      }
      
      messages.push({ role: 'user', content: request.prompt });
      
      const response = await this.provider.chatCompletion({
        model: AI_CONFIG.model,
        temperature: AI_CONFIG.temperature,
        maxTokens: AI_CONFIG.maxTokens,
        messages,
        signal, // Pass abort signal to provider
      });
      
      const content = response.choices[0].message.content;
      console.log('📝 Raw AI response length:', content.length);
      console.log('📝 Response preview:', content.substring(0, 300));
      
      const code = extractMermaidCode(content);
      console.log('📊 Extracted Mermaid code length:', code?.length || 0);
      console.log('📊 Code is empty?', !code || code.trim().length === 0);
      
      // Only validate if code was extracted and is not empty
      if (code && code.trim().length > 0) {
        console.log('🔍 Validating Mermaid code...');
        console.log('🔍 First 200 chars:', code.substring(0, 200));
        
        // Validate Mermaid syntax
        try {
          const validation = await validateMermaidSyntax(code);
          if (!validation.isValid) {
            console.error('❌ Invalid Mermaid code:');
            console.error('─'.repeat(80));
            console.log(code);
            console.error('─'.repeat(80));
            throw new Error(`Generated invalid Mermaid syntax: ${validation.error || 'Unknown error'}`);
          }
        } catch (validationError) {
          console.error('❌ Validation error:', validationError);
          throw validationError;
        }
        
        console.log('✅ Mermaid syntax validated successfully');
      } else {
        console.log('ℹ️ No Mermaid code in response - AI provided explanation only');
      }
      
      // Log raw content for debugging
      console.log('📄 Raw AI response:');
      console.log('─'.repeat(80));
      console.log(content);
      console.log('─'.repeat(80));
      
      // Extract metadata from response
      const title = extractTitle(content);
      const description = extractDescription(content);
      let explanation = extractExplanation(content);
      
      // If no code was generated, use the full content as explanation
      if (!code || code.trim().length === 0) {
        explanation = content.trim();
      }
      
      console.log('📝 Extracted metadata:');
      console.log('  - Title:', title || '(not found)');
      console.log('  - Description:', description || '(not found)');
      console.log('  - Explanation length:', explanation?.length || 0);
      
      // Extract diagram type from AI response, fallback to request type
      const extractedType = extractDiagramType(content);
      const finalType = (extractedType || request.type) as any;
      
      console.log('🏷️  Diagram Type:');
      console.log('  - Requested:', request.type);
      console.log('  - Extracted:', extractedType || '(not found)');
      console.log('  - Final:', finalType);
      
      // Warn if AI didn't follow type instruction
      if (extractedType && extractedType !== request.type) {
        console.warn(`⚠️  AI generated ${extractedType} but ${request.type} was requested. Using extracted type.`);
      }
      
      // Extract type-specific fields based on FINAL diagram type (not requested type)
      const typeSpecificData: Partial<DiagramGenerationResponse> = {
        type: finalType
      };
      
      if (finalType === 'endpoint') {
        typeSpecificData.httpMethod = extractHttpMethod(content);
        typeSpecificData.endpointPath = extractEndpointPath(content);
        typeSpecificData.requestPayloads = extractRequestPayloads(content);
        typeSpecificData.responsePayloads = extractResponsePayloads(content);
        
        console.log('📡 Endpoint-specific fields:');
        console.log('  - HTTP Method:', typeSpecificData.httpMethod || '(not found)');
        console.log('  - Endpoint Path:', typeSpecificData.endpointPath || '(not found)');
        console.log('  - Request Payloads:', typeSpecificData.requestPayloads?.length || 0);
        console.log('  - Response Payloads:', typeSpecificData.responsePayloads?.length || 0);
      } else if (finalType === 'workflow') {
        typeSpecificData.workflowActors = extractWorkflowActors(content);
        typeSpecificData.workflowTrigger = extractWorkflowTrigger(content);
        
        console.log('🔄 Workflow-specific fields:');
        console.log('  - Actors:', typeSpecificData.workflowActors || '(not found)');
        console.log('  - Trigger:', typeSpecificData.workflowTrigger || '(not found)');
      }
      
      return {
        success: true,
        data: {
          code,
          explanation,
          title,
          description,
          ...typeSpecificData
        },
        metadata: {
          provider: this.provider.name as any,
          model: response.model,
          tokensUsed: response.usage?.totalTokens,
          latency: Date.now() - startTime,
        },
      };
    } catch (error: any) {
      // Handle abort error gracefully
      if (error.name === 'AbortError' || error.message?.includes('aborted')) {
        throw new Error('Request was cancelled');
      }
      
      // Log error for analysis
      errorTrackingService.logAIError({
        type: 'ai_generation',
        message: error.message || 'Unknown error',
        stack: error.stack,
        prompt: request.prompt,
        requestPayload: { type: request.type, prompt: request.prompt, context: request.context },
        metadata: {
          provider: AI_CONFIG.provider,
          model: AI_CONFIG.model,
          latency: Date.now() - startTime,
        },
      });
      
      return this.handleError(error, startTime);
    }
  }
  
  async modifyDiagram(
    request: DiagramModificationRequest,
    signal?: AbortSignal
  ): Promise<AIResponse<DiagramModificationResponse>> {
    const startTime = Date.now();
    
    try {
      const systemPrompt = SYSTEM_PROMPTS.modify.base;
      const userPrompt = `Current diagram:\n\`\`\`mermaid\n${request.code}\n\`\`\`\n\nInstruction: ${request.instruction}`;
      
      const response = await this.provider.chatCompletion({
        model: AI_CONFIG.model,
        temperature: AI_CONFIG.temperature,
        maxTokens: AI_CONFIG.maxTokens,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        signal, // Pass abort signal to provider
      });
      
      const content = response.choices[0].message.content;
      const modifiedCode = extractMermaidCode(content);
      
      // Validate modified syntax
      const validation = await validateMermaidSyntax(modifiedCode);
      if (!validation.isValid) {
        throw new Error(`Modified diagram has invalid syntax: ${validation.error || 'Unknown error'}`);
      }
      
      return {
        success: true,
        data: {
          originalCode: request.code,
          modifiedCode,
          explanation: content,
          changes: [], // TODO: Extract changes from explanation
        },
        metadata: {
          provider: this.provider.name as any,
          model: response.model,
          tokensUsed: response.usage?.totalTokens,
          latency: Date.now() - startTime,
        },
      };
    } catch (error: any) {
      // Handle abort error gracefully
      if (error.name === 'AbortError' || error.message?.includes('aborted')) {
        throw new Error('Request was cancelled');
      }
      return this.handleError(error, startTime);
    }
  }
  
  async explainDiagram(code: string, signal?: AbortSignal): Promise<AIResponse<string>> {
    const startTime = Date.now();
    
    try {
      const systemPrompt = SYSTEM_PROMPTS.explain.base;
      const userPrompt = `Explain this Mermaid diagram:\n\`\`\`mermaid\n${code}\n\`\`\``;
      
      const response = await this.provider.chatCompletion({
        model: AI_CONFIG.model,
        temperature: 0.7,
        maxTokens: 1000,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        signal, // Pass abort signal to provider
      });
      
      return {
        success: true,
        data: response.choices[0].message.content,
        metadata: {
          provider: this.provider.name as any,
          model: response.model,
          tokensUsed: response.usage?.totalTokens,
          latency: Date.now() - startTime,
        },
      };
    } catch (error: any) {
      // Handle abort error gracefully
      if (error.name === 'AbortError' || error.message?.includes('aborted')) {
        throw new Error('Request was cancelled');
      }
      return this.handleError(error, startTime);
    }
  }
  
  private async handleError(error: any, startTime: number): Promise<AIResponse> {
    const aiError = this.provider.handleError(error);
    
    // Try fallback provider if error is recoverable
    if (aiError.recoverable && this.fallbackProvider) {
      try {
        console.warn(`Primary provider failed, trying fallback...`);
        // Retry with fallback (implementation omitted for MVP)
      } catch (fallbackError) {
        console.error('Fallback provider also failed');
      }
    }
    
    return {
      success: false,
      error: aiError,
      metadata: {
        provider: this.provider.name as any,
        model: AI_CONFIG.model,
        latency: Date.now() - startTime,
      },
    };
  }
  
  /**
   * Analyze user's intent to determine if they want to create a diagram
   * and what type of diagram they want
   */
  async analyzeIntent(userMessage: string, signal?: AbortSignal): Promise<{
    isQuestion: boolean;
    diagramType?: 'workflow' | 'endpoint' | 'sequence' | 'architecture' | 'state' | 'other' | 'context';
    confidence: 'high' | 'medium' | 'low';
    reasoning?: string;
  }> {
    try {
      const response = await this.provider.chatCompletion({
        model: AI_CONFIG.model,
        messages: [
          { role: 'system', content: INTENT_ANALYSIS_PROMPT },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.3, // Lower temperature for more consistent analysis
        maxTokens: 200,
        signal, // Pass abort signal to provider
      });

      // Parse the JSON response
      const content = response.choices[0]?.message.content.trim() || '{}';
      
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || content.match(/(\{[\s\S]*\})/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      
      const analysis = JSON.parse(jsonStr);
      
      console.log('🧠 Intent Analysis:', analysis);
      
      return {
        isQuestion: analysis.isQuestion || false,
        diagramType: analysis.diagramType,
        confidence: analysis.confidence || 'medium',
        reasoning: analysis.reasoning,
      };
    } catch (error: any) {
      console.error('❌ Intent analysis failed:', error);
      // Handle abort error gracefully
      if (error.name === 'AbortError' || error.message?.includes('aborted')) {
        throw new Error('Request was cancelled');
      }
      
      // For connection errors, throw them so the UI can show proper error message
      // Don't swallow connection errors by returning low confidence
      if (error.message?.includes('ERR_CONNECTION') || 
          error.message?.includes('Failed to fetch') ||
          error.message?.includes('Network error')) {
        throw error; // Re-throw connection errors
      }
      
      // For other errors (parsing, etc.), fallback to safe defaults
      return {
        isQuestion: false,
        diagramType: 'workflow',
        confidence: 'low',
        reasoning: 'Analysis failed, using defaults',
      };
    }
  }
}

// Singleton instance
export const aiService = new AIService();
