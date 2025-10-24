import { create } from 'zustand';
import { ChatMessage, Suggestion, AISettings } from '../services/ai/ai.types';
import { aiService } from '../services/ai/ai.service';
import { useDiagramStore } from './diagramStore';
import { useProjectStore } from './projectStore';
import { useAuthStore } from './authStore';
import { createDiagram } from '../services/diagram.service';
import { isSupabaseConfigured } from '../services/supabase';
import { Diagram } from '../types/diagram.types';
import toast from 'react-hot-toast';

interface AIStore {
  // UI State
  isOpen: boolean;
  isCollapsed: boolean;
  isGenerating: boolean;
  abortController: AbortController | null;
  
  // Messages - now stored per context
  messages: ChatMessage[];
  conversationContexts: Record<string, ChatMessage[]>; // diagramName -> messages
  
  // Suggestions
  diffPreview: Suggestion | null;
  
  // Context
  contextDiagram: { name: string; title: string; code: string; type: string } | null;
  
  // Settings
  settings: AISettings;
  
  // Actions
  open: () => void;
  close: () => void;
  toggleCollapse: () => void;
  setContextDiagram: (diagram: { name: string; title: string; code: string; type: string } | null) => void;
  sendMessage: (content: string, diagramType?: string) => Promise<void>;
  sendQuickAction: (action: string, diagramId?: string) => Promise<void>;
  stopGeneration: () => void;
  acceptSuggestion: () => void;
  acceptSuggestionAsNew: () => void;
  rejectSuggestion: () => void;
  reopenSuggestion: (suggestion: Suggestion) => void;
  updateSettings: (settings: Partial<AISettings>) => void;
  clearMessages: () => void;
  deleteMessage: (messageId: string) => void;
}

export const useAIStore = create<AIStore>((set, get) => ({
  isOpen: false,
  isCollapsed: false,
  isGenerating: false,
  abortController: null,
  messages: [],
  conversationContexts: {}, // Empty object to store per-diagram conversations
  diffPreview: null,
  contextDiagram: null,
  settings: {
    provider: 'flow',
    model: 'gpt-4.1',
    temperature: 0.7,
    maxTokens: 2000,
    enableAutoSuggestions: true,
    enableExplanations: true,
  },
  
  open: () => {
    // When opening global AI, clear diagram context and load global conversation
    const { conversationContexts, messages, contextDiagram } = get();
    
    // Save current context before switching to global
    if (contextDiagram) {
      conversationContexts[contextDiagram.name] = messages;
    }
    
    // Load global context
    const globalMessages = conversationContexts['__global__'] || [];
    
    set({ 
      isOpen: true, 
      contextDiagram: null,
      messages: globalMessages,
      conversationContexts: { ...conversationContexts },
    });
  },
  close: () => {
    // Save current context before closing
    const { contextDiagram, messages, conversationContexts } = get();
    if (contextDiagram) {
      conversationContexts[contextDiagram.name] = messages;
    } else {
      conversationContexts['__global__'] = messages;
    }
    
    set({ 
      isOpen: false,
      conversationContexts: { ...conversationContexts },
    });
  },
  toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  
  setContextDiagram: (diagram) => {
    const { conversationContexts, messages } = get();
    
    // Save current messages to context before switching
    const currentContext = get().contextDiagram;
    if (currentContext) {
      conversationContexts[currentContext.name] = messages;
    } else {
      // Save global context
      conversationContexts['__global__'] = messages;
    }
    
    // Load messages for new context
    let newMessages: ChatMessage[] = [];
    if (diagram) {
      // Load diagram-specific context
      newMessages = conversationContexts[diagram.name] || [];
      toast.success(`Editing: ${diagram.title}`);
    } else {
      // Load global context
      newMessages = conversationContexts['__global__'] || [];
    }
    
    set({ 
      contextDiagram: diagram, 
      isOpen: true,
      messages: newMessages,
      conversationContexts: { ...conversationContexts },
    });
  },
  
  sendMessage: async (content: string, diagramType?: string) => {
    // Create new abort controller for this request
    const controller = new AbortController();
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    set((state) => ({
      messages: [...state.messages, userMessage],
      isGenerating: true,
      abortController: controller,
    }));
    
    try {
      // Build conversation context from recent messages (last 5 messages)
      const { messages, contextDiagram } = get();
      const recentMessages = messages.slice(-5);
      let context = recentMessages
        .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n\n');
      
      // Add context diagram if set
      let contextDiagramType: string | undefined;
      if (contextDiagram) {
        context = `Current diagram being edited: "${contextDiagram.title}"\nDiagram code:\n${contextDiagram.code}\n\n${context}`;
        contextDiagramType = contextDiagram.type;
      }
      
      // AI-based diagram type detection if not specified
      // IMPORTANT: Always run intent analysis to detect conversion requests like "convert to endpoint"
      if (!diagramType) {
        // Ask AI to analyze the user's intent and determine diagram type
        const intentAnalysis = await aiService.analyzeIntent(content, controller.signal);
        
        if (intentAnalysis.isQuestion) {
          // User is asking a question, not requesting a diagram
          // Let the AI respond with explanation only
          diagramType = 'explanation'; // Special flag to skip diagram generation
        } else if (intentAnalysis.confidence === 'high' && intentAnalysis.diagramType) {
          // AI is confident about the type
          // Special case: "context" means preserve the context diagram type
          if (intentAnalysis.diagramType === 'context') {
            diagramType = contextDiagramType || 'workflow';
          } else {
            diagramType = intentAnalysis.diagramType;
          }
        } else if (intentAnalysis.confidence === 'low' || !intentAnalysis.diagramType) {
          // AI is unsure - ask user to clarify
          const clarificationMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `I'd be happy to help! To create the best diagram for you, which type would you like?\n\n📄 **Workflow** - Business process flows with multiple steps\n🔌 **Endpoint/API** - Single API endpoint logic and responses\n📝 **Sequence** - Interaction between systems/actors over time\n🏗️ **Architecture** - System design and component relationships\n🔀 **State Machine** - State transitions and lifecycle\n📄 **Other** - General purpose diagram\n\nPlease let me know which type, or describe your needs and I'll suggest one!`,
            timestamp: new Date(),
          };
          
          set((state) => ({
            messages: [...state.messages, clarificationMessage],
            isGenerating: false,
            abortController: null,
          }));
          return; // Wait for user's clarification
        } else {
          // Medium confidence - proceed but mention it in response
          // Special case: "context" means preserve the context diagram type
          if (intentAnalysis.diagramType === 'context') {
            diagramType = contextDiagramType || 'workflow';
          } else {
            diagramType = intentAnalysis.diagramType || contextDiagramType || 'workflow';
          }
        }
      }
      
      // Skip diagram generation if user was asking a question
      if (diagramType === 'explanation') {
        // User is asking a question - provide explanation only, no diagram
        // Build a prompt that includes the diagram context if available
        let explanationPrompt = content;
        if (contextDiagram) {
          explanationPrompt = `User question: ${content}\n\nContext - Current diagram:\nTitle: ${contextDiagram.title}\nType: ${contextDiagram.type}\nCode:\n\`\`\`mermaid\n${contextDiagram.code}\n\`\`\`\n\nPlease answer the user's question about this diagram.`;
        }
        
        const response = await aiService.explainDiagram(explanationPrompt, controller.signal);
        
        if (response.success && response.data) {
          const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: response.data,
            timestamp: new Date(),
          };
          
          set((state) => ({
            messages: [...state.messages, aiMessage],
            isGenerating: false,
          }));
          
          return; // Don't show diff preview
        } else {
          throw new Error(response.error?.message || 'Failed to generate explanation');
        }
      }
      
      const response = await aiService.generateDiagram({
        prompt: content,
        type: diagramType as any,
        context: context || undefined,
      }, controller.signal);
      
      if (response.success && response.data) {
        // Check if AI actually generated code or just provided an explanation
        const hasValidCode = response.data.code && response.data.code.trim().length > 0;
        
        if (!hasValidCode) {
          // AI responded with explanation only (no diagram to generate)
          const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: response.data.explanation || 'I understand your question.',
            timestamp: new Date(),
          };
          
          set((state) => ({
            messages: [...state.messages, aiMessage],
            isGenerating: false,
          }));
          
          return; // Don't show diff preview
        }
        
        // AI generated a diagram - proceed normally
        // Use the type from AI response if available, otherwise fall back to request type
        const finalDiagramType = response.data.type || diagramType;
        
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.data.explanation || 'Diagram generated successfully!',
          timestamp: new Date(),
          metadata: {
            code: response.data.code,
            diagramType: finalDiagramType,
            type: finalDiagramType, // Add 'type' field for consistency
            title: response.data.title,
            description: response.data.description,
            // Include type-specific fields in chat message too
            httpMethod: response.data.httpMethod,
            endpointPath: response.data.endpointPath,
            requestPayloads: response.data.requestPayloads,
            responsePayloads: response.data.responsePayloads,
            workflowActors: response.data.workflowActors,
            workflowTrigger: response.data.workflowTrigger,
          },
        };
        
        set((state) => ({
          messages: [...state.messages, aiMessage],
          isGenerating: false,
          abortController: null,
          diffPreview: {
            id: Date.now().toString(),
            type: 'generate',
            suggestedCode: response.data!.code,
            explanation: response.data!.explanation || '',
            confidence: 0.9,
            metadata: { 
              type: finalDiagramType,
              title: response.data!.title,
              description: response.data!.description,
              // Include type-specific fields
              httpMethod: response.data!.httpMethod,
              endpointPath: response.data!.endpointPath,
              requestPayloads: response.data!.requestPayloads,
              responsePayloads: response.data!.responsePayloads,
              workflowActors: response.data!.workflowActors,
              workflowTrigger: response.data!.workflowTrigger,
            },
          },
        }));
        
        toast.success('Diagram generated! Review and accept to add it.');
      } else {
        throw new Error(response.error?.message || 'Failed to generate diagram');
      }
    } catch (error: any) {
      // Don't show error message if request was aborted
      if (error.message === 'Request was cancelled') {
        set({ 
          isGenerating: false, 
          abortController: null 
        });
        return; // Silent abort - toast already shown by stopGeneration
      }
      
      // Debug logging
      console.error('🔴 aiStore caught error:', error);
      console.error('🔴 Error message:', error.message);
      
      // Determine error type and provide helpful message
      let errorContent = '';
      
      if (error.message?.includes('ECONNREFUSED') || error.message?.includes('net::ERR_CONNECTION_REFUSED')) {
        errorContent = `🔌 **Connection Error**\n\nI couldn't connect to the AI service. This usually means:\n\n1. **Local Development**: The proxy server isn't running\n   - Run \`npm start\` in the \`server/\` directory\n   - Make sure it's running on port 3001\n\n2. **Missing Credentials**: Environment variables not set\n   - Check that \`.env.local\` has \`FLOW_CLIENT_ID\` and \`FLOW_CLIENT_SECRET\`\n\n3. **Network Issue**: Check your internet connection\n\nPlease fix the issue and try again.`;
      } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        errorContent = `🌐 **Network Error**\n\nI couldn't reach the AI service. Please check:\n\n- Your internet connection is working\n- The proxy server is running (local dev)\n- Netlify Functions are deployed (production)\n\nTry again in a moment.`;
      } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        errorContent = `🔐 **Authentication Error**\n\nThe AI service rejected the credentials. Please verify:\n\n- \`FLOW_CLIENT_ID\` and \`FLOW_CLIENT_SECRET\` are correct\n- Credentials haven't expired\n- You have access to the Flow API\n\nContact your administrator if the issue persists.`;
      } else if (error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
        errorContent = `⏱️ **Rate Limit Exceeded**\n\nYou've made too many requests. Please wait a moment and try again.`;
      } else if (error.message?.includes('500') || error.message?.includes('Internal Server Error')) {
        errorContent = `⚠️ **Server Error**\n\nThe AI service encountered an internal error. This is usually temporary.\n\nPlease try again in a few moments.`;
      } else {
        // Generic error with the actual message
        errorContent = `❌ **Error**\n\nSomething went wrong: ${error.message}\n\nPlease try again or contact support if the issue persists.`;
      }
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorContent,
        timestamp: new Date(),
      };
      
      set((state) => ({
        messages: [...state.messages, errorMessage],
        isGenerating: false,
        abortController: null,
      }));
      
      toast.error('Failed to generate diagram');
    }
  },
  
  sendQuickAction: async (action: string, diagramId?: string) => {
    if (action === 'explain' && diagramId) {
      const diagram = useDiagramStore.getState().diagrams.find(d => d.name === diagramId);
      if (!diagram) return;
      
      // Create abort controller for this request
      const controller = new AbortController();
      
      set({ 
        isGenerating: true,
        abortController: controller,
      });
      
      try {
        const response = await aiService.explainDiagram(diagram.code, controller.signal);
        
        if (response.success && response.data) {
          const aiMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: response.data,
            timestamp: new Date(),
          };
          
          set((state) => ({
            messages: [...state.messages, aiMessage],
            isGenerating: false,
            abortController: null,
          }));
          
          toast.success('Explanation generated!');
        }
      } catch (error: any) {
        // Don't show error if request was aborted
        if (error.message === 'Request was cancelled') {
          set({ 
            isGenerating: false, 
            abortController: null 
          });
          return; // Silent abort
        }
        
        toast.error('Failed to explain diagram');
        set({ isGenerating: false, abortController: null });
      }
    }
  },
  
  acceptSuggestion: async () => {
    const { diffPreview, contextDiagram } = get();
    if (!diffPreview || !diffPreview.suggestedCode) return;
    
    const diagramStore = useDiagramStore.getState();
    const diagramType = diffPreview.metadata?.type || 'other';
    
    // If we're editing an existing diagram, update it
    if (contextDiagram) {
      const existingDiagram = diagramStore.diagrams.find(d => d.name === contextDiagram.name);
      if (existingDiagram) {
        diagramStore.updateDiagram({
          ...existingDiagram,
          code: diffPreview.suggestedCode,
          type: diagramType,
          // Preserve original title and description when editing
          title: existingDiagram.title,
          description: existingDiagram.description,
          // Update type-specific fields if present
          ...(diffPreview.metadata?.httpMethod && { httpMethod: diffPreview.metadata.httpMethod }),
          ...(diffPreview.metadata?.endpointPath && { endpointPath: diffPreview.metadata.endpointPath }),
          ...(diffPreview.metadata?.requestPayloads && { requestPayloads: diffPreview.metadata.requestPayloads }),
          ...(diffPreview.metadata?.responsePayloads && { responsePayloads: diffPreview.metadata.responsePayloads }),
          ...(diffPreview.metadata?.workflowActors && { workflowActors: diffPreview.metadata.workflowActors }),
          ...(diffPreview.metadata?.workflowTrigger && { workflowTrigger: diffPreview.metadata.workflowTrigger }),
          updatedAt: new Date().toISOString(),
        });
      }
      
      set({ diffPreview: null });
      // Keep contextDiagram so user can continue editing
      toast.success('Diagram updated successfully!');
    } else {
      // Create a new diagram - check if in collaboration mode
      if (isSupabaseConfigured()) {
        const { currentFolder } = useProjectStore.getState();
        const { user } = useAuthStore.getState();
        
        if (!currentFolder) {
          toast.error('Please select a folder first');
          set({ diffPreview: null });
          return;
        }
        
        if (!user) {
          toast.error('You must be logged in');
          set({ diffPreview: null });
          return;
        }
        
        // Save to Supabase
        const result = await createDiagram({
          folder_id: currentFolder.id,
          created_by: user.id,
          name: `ai-diagram-${Date.now()}`,
          title: diffPreview.metadata?.title || `AI Generated ${diagramType.charAt(0).toUpperCase() + diagramType.slice(1)}`,
          description: diffPreview.metadata?.description || diffPreview.explanation.slice(0, 200),
          code: diffPreview.suggestedCode,
          type: diagramType,
          tags: 'ai-generated',
          httpMethod: diffPreview.metadata?.httpMethod,
          endpointPath: diffPreview.metadata?.endpointPath,
          requestPayloads: diffPreview.metadata?.requestPayloads,
          responsePayloads: diffPreview.metadata?.responsePayloads,
          workflowActors: diffPreview.metadata?.workflowActors,
          workflowTrigger: diffPreview.metadata?.workflowTrigger,
        });
        
        if (result.success && result.data) {
          // Add to store only (diagram already saved to Supabase)
          const { cloudDiagramToLocal } = await import('../services/diagram.service');
          const localDiagram = cloudDiagramToLocal(result.data);
          diagramStore.addDiagramToStore(localDiagram); // Store only, no Supabase
          toast.success('Diagram added successfully!');
        } else {
          toast.error(`Failed to save: ${result.error}`);
        }
      } else {
        // Demo mode: use localStorage
        diagramStore.addDiagram({
          name: `ai-diagram-${Date.now()}`,
          title: diffPreview.metadata?.title || `AI Generated ${diagramType.charAt(0).toUpperCase() + diagramType.slice(1)}`,
          description: diffPreview.metadata?.description || diffPreview.explanation.slice(0, 200),
          code: diffPreview.suggestedCode,
          type: diagramType,
          tags: 'ai-generated',
          ...(diffPreview.metadata?.httpMethod && { httpMethod: diffPreview.metadata.httpMethod }),
          ...(diffPreview.metadata?.endpointPath && { endpointPath: diffPreview.metadata.endpointPath }),
          ...(diffPreview.metadata?.requestPayloads && { requestPayloads: diffPreview.metadata.requestPayloads }),
          ...(diffPreview.metadata?.responsePayloads && { responsePayloads: diffPreview.metadata.responsePayloads }),
          ...(diffPreview.metadata?.workflowActors && { workflowActors: diffPreview.metadata.workflowActors }),
          ...(diffPreview.metadata?.workflowTrigger && { workflowTrigger: diffPreview.metadata.workflowTrigger }),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        toast.success('Diagram added successfully!');
      }
      
      set({ diffPreview: null });
    }
  },
  
  acceptSuggestionAsNew: async () => {
    const { diffPreview, contextDiagram } = get();
    if (!diffPreview || !diffPreview.suggestedCode) return;
    
    const diagramStore = useDiagramStore.getState();
    const diagramType = diffPreview.metadata?.type || 'other';
    const baseName = contextDiagram?.title || 'AI Generated Diagram';
    
    // Check if in collaboration mode
    if (isSupabaseConfigured()) {
      const { currentFolder } = useProjectStore.getState();
      const { user } = useAuthStore.getState();
      
      if (!currentFolder) {
        toast.error('Please select a folder first');
        set({ diffPreview: null });
        return;
      }
      
      if (!user) {
        toast.error('You must be logged in');
        set({ diffPreview: null });
        return;
      }
      
      // Save to Supabase
      const result = await createDiagram({
        folder_id: currentFolder.id,
        created_by: user.id,
        name: `ai-diagram-${Date.now()}`,
        title: diffPreview.metadata?.title || `${baseName} (Copy)`,
        description: diffPreview.metadata?.description || diffPreview.explanation.slice(0, 200),
        code: diffPreview.suggestedCode,
        type: diagramType,
        tags: contextDiagram ? `${contextDiagram.name},ai-modified` : 'ai-generated',
        httpMethod: diffPreview.metadata?.httpMethod,
        endpointPath: diffPreview.metadata?.endpointPath,
        requestPayloads: diffPreview.metadata?.requestPayloads,
        responsePayloads: diffPreview.metadata?.responsePayloads,
        workflowActors: diffPreview.metadata?.workflowActors,
        workflowTrigger: diffPreview.metadata?.workflowTrigger,
      });
      
      if (result.success && result.data) {
        // Add to store only (diagram already saved to Supabase)
        const { cloudDiagramToLocal } = await import('../services/diagram.service');
        const localDiagram = cloudDiagramToLocal(result.data);
        diagramStore.addDiagramToStore(localDiagram); // Store only, no Supabase
        toast.success('Diagram added successfully!');
      } else {
        toast.error(`Failed to save: ${result.error}`);
      }
    } else {
      // Demo mode: use localStorage
      diagramStore.addDiagram({
        name: `ai-diagram-${Date.now()}`,
        title: diffPreview.metadata?.title || `${baseName} (Copy)`,
        description: diffPreview.metadata?.description || diffPreview.explanation.slice(0, 200),
        code: diffPreview.suggestedCode,
        type: diagramType,
        tags: contextDiagram ? `${contextDiagram.name},ai-modified` : 'ai-generated',
        ...(diffPreview.metadata?.httpMethod && { httpMethod: diffPreview.metadata.httpMethod }),
        ...(diffPreview.metadata?.endpointPath && { endpointPath: diffPreview.metadata.endpointPath }),
        ...(diffPreview.metadata?.requestPayloads && { requestPayloads: diffPreview.metadata.requestPayloads }),
        ...(diffPreview.metadata?.responsePayloads && { responsePayloads: diffPreview.metadata.responsePayloads }),
        ...(diffPreview.metadata?.workflowActors && { workflowActors: diffPreview.metadata.workflowActors }),
        ...(diffPreview.metadata?.workflowTrigger && { workflowTrigger: diffPreview.metadata.workflowTrigger }),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast.success('New diagram created successfully!');
    }
    
    set({ diffPreview: null });
  },
  
  rejectSuggestion: () => {
    set({ diffPreview: null });
    toast('Suggestion rejected');
  },
  
  reopenSuggestion: (suggestion) => {
    set({ diffPreview: suggestion });
    toast.success('Diagram preview reopened!');
  },
  
  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
  },
  
  clearMessages: () => {
    const { contextDiagram, conversationContexts } = get();
    
    // Clear current context
    if (contextDiagram) {
      // Clear diagram-specific context
      delete conversationContexts[contextDiagram.name];
      set({ 
        messages: [],
        conversationContexts: { ...conversationContexts },
      });
    } else {
      // Clear global context
      delete conversationContexts['__global__'];
      set({ 
        messages: [],
        conversationContexts: { ...conversationContexts },
      });
    }
  },
  
  stopGeneration: () => {
    const { abortController } = get();
    if (abortController) {
      abortController.abort();
      set({ 
        isGenerating: false, 
        abortController: null 
      });
      toast('Generation stopped', { icon: '⏹️' });
    }
  },
  
  deleteMessage: (messageId: string) => {
    const { messages, contextDiagram, conversationContexts } = get();
    const updatedMessages = messages.filter(msg => msg.id !== messageId);
    
    // Update current messages
    set({ messages: updatedMessages });
    
    // Update stored context
    if (contextDiagram) {
      conversationContexts[contextDiagram.name] = updatedMessages;
    } else {
      conversationContexts['__global__'] = updatedMessages;
    }
    
    set({ conversationContexts: { ...conversationContexts } });
  },
}));
