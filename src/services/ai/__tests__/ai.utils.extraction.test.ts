import { describe, it, expect } from 'vitest';
import { extractMermaidCode, extractTitle, extractDescription, extractDiagramType } from '../ai.utils';
import * as responses from './fixtures/ai-responses';

describe('extractMermaidCode', () => {
  describe('Valid Code Extraction', () => {
    it('should extract code from mermaid code block', () => {
      const result = extractMermaidCode(responses.AI_RESPONSE_VALID_WORKFLOW);
      
      expect(result).toContain('flowchart TD');
      expect(result).toContain('Start[User Starts Login]');
      expect(result).toContain('Validate{Valid Credentials?}');
      expect(result).not.toContain('```');
    });

    it('should extract code from endpoint response with multiple JSON blocks', () => {
      const result = extractMermaidCode(responses.AI_RESPONSE_VALID_ENDPOINT);
      
      expect(result).toContain('flowchart TD');
      expect(result).toContain('POST /auth/login');
      expect(result).not.toContain('json');
      expect(result).not.toContain('"email"');
    });

    it('should extract code when multiple code blocks exist', () => {
      const result = extractMermaidCode(responses.AI_RESPONSE_MULTIPLE_CODE_BLOCKS);
      
      expect(result).toContain('flowchart TD');
      expect(result).toContain('A --> B');
      expect(result).not.toContain('"test"');
    });

    it('should extract sequence diagram code', () => {
      const result = extractMermaidCode(responses.AI_RESPONSE_SEQUENCE_DIAGRAM);
      
      expect(result).toContain('sequenceDiagram');
      expect(result).toContain('participant User');
    });

    it('should extract code without language specifier if it contains diagram keywords', () => {
      const content = `\`\`\`
flowchart TD
  A --> B
\`\`\``;
      
      const result = extractMermaidCode(content);
      expect(result).toContain('flowchart TD');
    });
  });

  describe('Invalid Code Rejection', () => {
    it('should return empty string for explanation-only response', () => {
      const result = extractMermaidCode(responses.AI_RESPONSE_EXPLANATION_ONLY);
      
      expect(result).toBe('');
    });

    it('should reject markdown separators', () => {
      const result = extractMermaidCode(responses.AI_RESPONSE_WITH_MARKDOWN_SEPARATORS);
      
      // Should not extract the --- separators
      expect(result).not.toContain('---');
      expect(result).not.toContain('**Title:**');
    });

    it('should return empty string for response with only metadata', () => {
      const result = extractMermaidCode(responses.AI_RESPONSE_ONLY_METADATA);
      
      expect(result).toBe('');
    });

    it('should return empty string for empty response', () => {
      const result = extractMermaidCode(responses.AI_RESPONSE_EMPTY);
      
      expect(result).toBe('');
    });

    it('should ignore JSON code blocks', () => {
      const content = `\`\`\`json
{
  "test": "data"
}
\`\`\``;
      
      const result = extractMermaidCode(content);
      expect(result).toBe('');
    });

    it('should ignore code blocks without diagram keywords', () => {
      const content = `\`\`\`
This is just text
No diagram here
\`\`\``;
      
      const result = extractMermaidCode(content);
      expect(result).toBe('');
    });
  });

  describe('Edge Cases', () => {
    it('should handle code block with extra whitespace', () => {
      const content = `\`\`\`mermaid
      
      flowchart TD
        A --> B
        
\`\`\``;
      
      const result = extractMermaidCode(content);
      expect(result).toContain('flowchart TD');
      expect(result.trim()).not.toMatch(/^\s+flowchart/);
    });

    it('should handle code without closing backticks', () => {
      const content = `\`\`\`mermaid
flowchart TD
  A --> B`;
      
      const result = extractMermaidCode(content);
      // Should still extract if it finds diagram keywords
      expect(result).toContain('flowchart TD');
    });

    it('should handle mixed case language specifier', () => {
      const content = `\`\`\`MERMAID
flowchart TD
  A --> B
\`\`\``;
      
      const result = extractMermaidCode(content);
      expect(result).toContain('flowchart TD');
    });

    it('should handle code with direction on separate line', () => {
      const content = `\`\`\`mermaid
TD
A --> B
\`\`\``;
      
      const result = extractMermaidCode(content);
      // Should prepend "flowchart" to direction
      expect(result).toContain('flowchart TD');
    });
  });
});

describe('extractTitle', () => {
  it('should extract title from AI response', () => {
    const result = extractTitle(responses.AI_RESPONSE_VALID_WORKFLOW);
    
    expect(result).toBe('User Authentication Flow');
  });

  it('should extract title from endpoint response', () => {
    const result = extractTitle(responses.AI_RESPONSE_VALID_ENDPOINT);
    
    expect(result).toBe('User Authentication Endpoint');
  });

  it('should return undefined when no title present', () => {
    const result = extractTitle(responses.AI_RESPONSE_EXPLANATION_ONLY);
    
    expect(result).toBeUndefined();
  });

  it('should handle title with special characters', () => {
    const content = 'Title: User Auth (v2) - Enhanced Flow';
    const result = extractTitle(content);
    
    expect(result).toBe('User Auth (v2) - Enhanced Flow');
  });

  it('should trim whitespace from title', () => {
    const content = 'Title:   User Authentication Flow   ';
    const result = extractTitle(content);
    
    expect(result).toBe('User Authentication Flow');
  });
});

describe('extractDescription', () => {
  it('should extract description from AI response', () => {
    const result = extractDescription(responses.AI_RESPONSE_VALID_WORKFLOW);
    
    expect(result).toBe('Complete login process with validation and error handling');
  });

  it('should extract description from endpoint response', () => {
    const result = extractDescription(responses.AI_RESPONSE_VALID_ENDPOINT);
    
    expect(result).toBe('POST /auth/login endpoint with validation and error handling');
  });

  it('should return undefined when no description present', () => {
    const result = extractDescription(responses.AI_RESPONSE_EXPLANATION_ONLY);
    
    expect(result).toBeUndefined();
  });

  it('should handle multi-line description', () => {
    const content = `Description: This is a long description
that spans multiple lines
and continues here`;
    const result = extractDescription(content);
    
    // Should only get the first line
    expect(result).toBe('This is a long description');
  });
});

describe('extractDiagramType', () => {
  it('should extract workflow type', () => {
    const result = extractDiagramType(responses.AI_RESPONSE_VALID_WORKFLOW);
    
    expect(result).toBe('workflow');
  });

  it('should extract endpoint type', () => {
    const result = extractDiagramType(responses.AI_RESPONSE_VALID_ENDPOINT);
    
    expect(result).toBe('endpoint');
  });

  it('should extract sequence type', () => {
    const result = extractDiagramType(responses.AI_RESPONSE_SEQUENCE_DIAGRAM);
    
    expect(result).toBe('sequence');
  });

  it('should return undefined when no type present', () => {
    const result = extractDiagramType(responses.AI_RESPONSE_EXPLANATION_ONLY);
    
    expect(result).toBeUndefined();
  });

  it('should handle case-insensitive type', () => {
    const content = 'Diagram Type: WORKFLOW';
    const result = extractDiagramType(content);
    
    expect(result).toBe('workflow');
  });

  it('should validate against known types', () => {
    const content = 'Diagram Type: invalid_type';
    const result = extractDiagramType(content);
    
    // Should return undefined for invalid types
    expect(result).toBeUndefined();
  });
});
