/**
 * Error Tracking Service
 * 
 * Captures and stores errors that occur during AI interactions and diagram rendering.
 * This helps analyze issues and improve the application over time.
 */

export interface AIErrorLog {
  id: string;
  timestamp: Date;
  errorType: 'ai_generation' | 'ai_modification' | 'ai_explanation' | 'mermaid_render' | 'api_error';
  errorMessage: string;
  errorStack?: string;
  
  // AI Request Context
  userPrompt?: string;
  aiResponse?: string;
  requestPayload?: Record<string, any>;
  responsePayload?: Record<string, any>;
  
  // Diagram Context
  diagramCode?: string;
  diagramType?: string;
  sanitizedCode?: string;
  
  // User Context
  userId?: string;
  sessionId?: string;
  
  // Additional metadata
  metadata?: Record<string, any>;
}

class ErrorTrackingService {
  private readonly STORAGE_KEY = 'mermaid_error_logs';
  private readonly MAX_LOGS = 100; // Keep last 100 errors
  
  /**
   * Log an AI interaction error
   */
  logAIError(error: {
    type: AIErrorLog['errorType'];
    message: string;
    stack?: string;
    prompt?: string;
    aiResponse?: string;
    requestPayload?: Record<string, any>;
    responsePayload?: Record<string, any>;
    metadata?: Record<string, any>;
  }): void {
    const errorLog: AIErrorLog = {
      id: this.generateId(),
      timestamp: new Date(),
      errorType: error.type,
      errorMessage: error.message,
      errorStack: error.stack,
      userPrompt: error.prompt,
      aiResponse: error.aiResponse,
      requestPayload: error.requestPayload,
      responsePayload: error.responsePayload,
      sessionId: this.getSessionId(),
      metadata: error.metadata,
    };
    
    this.saveError(errorLog);
    console.error('🚨 Error logged:', errorLog);
  }
  
  /**
   * Log a Mermaid rendering error
   */
  logMermaidError(error: {
    message: string;
    stack?: string;
    diagramCode: string;
    diagramType?: string;
    sanitizedCode?: string;
    metadata?: Record<string, any>;
  }): void {
    const errorLog: AIErrorLog = {
      id: this.generateId(),
      timestamp: new Date(),
      errorType: 'mermaid_render',
      errorMessage: error.message,
      errorStack: error.stack,
      diagramCode: error.diagramCode,
      diagramType: error.diagramType,
      sanitizedCode: error.sanitizedCode,
      sessionId: this.getSessionId(),
      metadata: error.metadata,
    };
    
    this.saveError(errorLog);
    console.error('🚨 Mermaid error logged:', errorLog);
  }
  
  /**
   * Get all error logs
   */
  getAllErrors(): AIErrorLog[] {
    try {
      const logs = localStorage.getItem(this.STORAGE_KEY);
      if (!logs) return [];
      
      const parsed = JSON.parse(logs);
      // Convert timestamp strings back to Date objects
      return parsed.map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp),
      }));
    } catch (error) {
      console.error('Failed to retrieve error logs:', error);
      return [];
    }
  }
  
  /**
   * Get errors by type
   */
  getErrorsByType(type: AIErrorLog['errorType']): AIErrorLog[] {
    return this.getAllErrors().filter(log => log.errorType === type);
  }
  
  /**
   * Get recent errors (last N)
   */
  getRecentErrors(count: number = 10): AIErrorLog[] {
    return this.getAllErrors()
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, count);
  }
  
  /**
   * Export errors as JSON for analysis
   */
  exportErrors(): string {
    const errors = this.getAllErrors();
    return JSON.stringify(errors, null, 2);
  }
  
  /**
   * Clear all error logs
   */
  clearErrors(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('✅ Error logs cleared');
  }
  
  /**
   * Get error statistics
   */
  getErrorStats(): {
    total: number;
    byType: Record<string, number>;
    last24Hours: number;
    last7Days: number;
  } {
    const errors = this.getAllErrors();
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const byType: Record<string, number> = {};
    let last24Hours = 0;
    let last7Days = 0;
    
    errors.forEach(error => {
      // Count by type
      byType[error.errorType] = (byType[error.errorType] || 0) + 1;
      
      // Count recent errors
      if (error.timestamp >= oneDayAgo) last24Hours++;
      if (error.timestamp >= sevenDaysAgo) last7Days++;
    });
    
    return {
      total: errors.length,
      byType,
      last24Hours,
      last7Days,
    };
  }
  
  // Private helper methods
  
  private saveError(errorLog: AIErrorLog): void {
    try {
      const existingLogs = this.getAllErrors();
      const updatedLogs = [errorLog, ...existingLogs].slice(0, this.MAX_LOGS);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedLogs));
    } catch (error) {
      console.error('Failed to save error log:', error);
    }
  }
  
  private generateId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private getSessionId(): string {
    const SESSION_KEY = 'mermaid_session_id';
    let sessionId = sessionStorage.getItem(SESSION_KEY);
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(SESSION_KEY, sessionId);
    }
    
    return sessionId;
  }
}

// Export singleton instance
export const errorTrackingService = new ErrorTrackingService();

// Export for debugging in console
if (typeof window !== 'undefined') {
  (window as any).errorTrackingService = errorTrackingService;
}
