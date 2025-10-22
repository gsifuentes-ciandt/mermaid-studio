import { describe, it, expect } from 'vitest';
import { sanitizeMermaidCode } from '../ai.utils';

describe('sanitizeMermaidCode', () => {
  describe('HTML Tag Removal', () => {
    it('should remove <br/> tags', () => {
      const code = `flowchart TD
  A[Text with<br/>line break] --> B`;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).not.toContain('<br/>');
      expect(result).toContain('Text with line break');
    });

    it('should remove <b> tags', () => {
      const code = `flowchart TD
  A[<b>Bold Text</b>] --> B`;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).not.toContain('<b>');
      expect(result).not.toContain('</b>');
      expect(result).toContain('Bold Text');
    });

    it('should remove <i> tags', () => {
      const code = `flowchart TD
  A[<i>Italic Text</i>] --> B`;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).not.toContain('<i>');
      expect(result).not.toContain('</i>');
    });

    it('should remove multiple HTML tags', () => {
      const code = `flowchart TD
  A[<b>Bold</b> and <i>Italic</i> and<br/>Break] --> B`;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).not.toContain('<b>');
      expect(result).not.toContain('</b>');
      expect(result).not.toContain('<i>');
      expect(result).not.toContain('</i>');
      expect(result).not.toContain('<br/>');
      expect(result).toContain('Bold and Italic and Break');
      expect(result).toContain('-->'); // Arrows should remain
    });
  });

  describe('Special Character Handling', () => {
    it('should remove literal \\n escape sequences from node labels', () => {
      const code = `flowchart TD
  Start[POST /checkout\\nRequest: {cartId, userId}] --> CartValidate[Validate Cart\\nResponse: {success, error}]`;
      
      const result = sanitizeMermaidCode(code);
      
      // Literal \n should be replaced with spaces
      expect(result).not.toContain('\\n');
      expect(result).toContain('POST /checkout Request: {cartId, userId}');
      expect(result).toContain('Validate Cart Response: {success, error}');
    });

    it('should remove literal \\r and \\t escape sequences from node labels', () => {
      const code = `flowchart TD
  A[Text with\\rcarriage return] --> B[Text with\\ttab]`;
      
      const result = sanitizeMermaidCode(code);
      
      // Literal \r and \t should be replaced with spaces
      expect(result).not.toContain('\\r');
      expect(result).not.toContain('\\t');
      expect(result).toContain('Text with carriage return');
      expect(result).toContain('Text with tab');
    });

    it('should remove escape sequences from decision node labels', () => {
      const code = `flowchart TD
  A --> B{Is Valid?\\nCheck Status}`;
      
      const result = sanitizeMermaidCode(code);
      
      // Literal \n should be removed from decision nodes too
      expect(result).not.toContain('\\n');
      expect(result).toContain('Is Valid? Check Status');
    });

    it('should replace parentheses in node labels with dashes', () => {
      const code = `flowchart TD
  A[Function(param1, param2)] --> B`;
      
      const result = sanitizeMermaidCode(code);
      
      // Parentheses are replaced with dashes to avoid parse errors
      expect(result).not.toContain('(param1, param2)');
      expect(result).toContain('Function- param1, param2');
    });

    it('should preserve quotes outside curly braces', () => {
      const code = `flowchart TD
  A["Quoted text"] --> B`;
      
      const result = sanitizeMermaidCode(code);
      
      // Quotes outside curly braces are preserved
      expect(result).toContain('"Quoted text"');
    });

    it('should preserve brackets in node labels', () => {
      const code = `flowchart TD
  A[Text with [brackets]] --> B`;
      
      const result = sanitizeMermaidCode(code);
      
      // Brackets are now preserved for array notation
      expect(result).toContain('Text with [brackets]');
    });

    it('should preserve curly braces in node labels', () => {
      const code = `flowchart TD
  A[Text with {braces}] --> B`;
      
      const result = sanitizeMermaidCode(code);
      
      // Curly braces are now preserved for JSON objects
      expect(result).toContain('Text with {braces}');
    });

    it('should replace pipe characters in node labels', () => {
      const code = `flowchart TD
  A[Response: {valid: true|false}] --> B`;
      
      const result = sanitizeMermaidCode(code);
      
      // Pipe characters are replaced with forward slashes
      expect(result).not.toContain('true|false');
      expect(result).toContain('true/false');
      expect(result).toContain('{valid: true/false}');
    });

    it('should handle error response labels with parentheses', () => {
      const code = `flowchart TD
  CartValid -- No --> CartErr[422 Unprocessable Entity (Cart Error Response)]
  InventoryAvailable -- No --> InvErr[409 Conflict (Out-of-Stock Response)]`;
      
      const result = sanitizeMermaidCode(code);
      
      // Parentheses should be replaced with dashes
      expect(result).not.toContain('(Cart Error Response)');
      expect(result).not.toContain('(Out-of-Stock Response)');
      expect(result).toContain('422 Unprocessable Entity - Cart Error Response');
      expect(result).toContain('409 Conflict - Out-of-Stock Response');
    });

    it('should remove quotes from inside curly braces', () => {
      const code = `flowchart TD
  CartError[Respond: {status:400, error:"Invalid cart"}]
  PaymentRollback[Respond: {status:402, error:"Payment failed"}]`;
      
      const result = sanitizeMermaidCode(code);
      
      // Quotes inside curly braces should be removed
      expect(result).not.toContain('error:"Invalid cart"');
      expect(result).not.toContain('error:"Payment failed"');
      expect(result).toContain('{status:400, error:Invalid cart}');
      expect(result).toContain('{status:402, error:Payment failed}');
    });
  });

  describe('Reserved Keyword Replacement', () => {
    it('should replace "end" keyword in class names', () => {
      const code = `flowchart TD
  A --> B
  class A,B end`;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).toContain('endStyle');
      expect(result).not.toMatch(/class.*\bend\b/);
    });

    it('should replace "else" keyword', () => {
      const code = `flowchart TD
  A --> B
  class A else`;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).toContain('elseStyle');
    });

    it('should replace "alt" keyword', () => {
      const code = `flowchart TD
  A --> B
  class A alt`;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).toContain('altStyle');
    });

    it('should replace "loop" keyword', () => {
      const code = `flowchart TD
  A --> B
  class A loop`;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).toContain('loopStyle');
    });

    it('should replace multiple reserved keywords', () => {
      const code = `flowchart TD
  A --> B
  class A end
  class B alt
  class C loop`;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).toContain('endStyle');
      expect(result).toContain('altStyle');
      expect(result).toContain('loopStyle');
    });

    it('should replace reserved keywords in classDef', () => {
      const code = `flowchart TD
  A --> B
  classDef end fill:#f00`;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).toContain('classDef endStyle');
    });

    it('should replace reserved keywords in class usage', () => {
      const code = `flowchart TD
  A --> B
  A:::end`;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).toContain(':::endStyle');
    });
  });

  describe('Arrow Direction Fixing', () => {
    it('should fix reverse arrows', () => {
      const code = `flowchart TD
  A <-- B
  B --> C`;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).not.toContain('<--');
      expect(result).toContain('B --> A');
      expect(result).toContain('B --> C');
    });

    it('should fix multiple reverse arrows', () => {
      const code = `flowchart TD
  A <-- B
  C <-- D
  E --> F`;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).not.toContain('<--');
      expect(result).toContain('B --> A');
      expect(result).toContain('D --> C');
      expect(result).toContain('E --> F');
    });
  });

  describe('Config Block Removal', () => {
    it('should remove YAML-style config blocks with --- delimiters', () => {
      const code = `---
config:
  themeVariables:
    htmlLabels: false
---

flowchart TD
    A[Start] --> B[End]`;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).not.toContain('---');
      expect(result).not.toContain('config:');
      expect(result).not.toContain('themeVariables');
      expect(result).toContain('flowchart TD');
      expect(result).toContain('A[Start]');
    });

    it('should remove Note over config lines', () => {
      const code = `Note over config: themeVariables:
Note over htmlLabels: false
flowchart TD
    A --> B`;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).not.toContain('Note over');
      expect(result).not.toContain('config:');
      expect(result).toContain('flowchart TD');
    });
  });

  describe('Subgraph Syntax Fixing', () => {
    it('should fix subgraph with trapezoid shape', () => {
      const code = `flowchart TD
    subgraph folder[/folder/]
        file1[file.txt]
    end`;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).toContain('subgraph folder');
      expect(result).not.toContain('subgraph folder[/folder/]');
    });

    it('should fix subgraph with stadium shape', () => {
      const code = `flowchart TD
    subgraph process([process])
        step1[Step 1]
    end`;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).toContain('subgraph process');
      expect(result).not.toContain('subgraph process([process])');
    });

    it('should fix subgraph with subroutine shape', () => {
      const code = `flowchart TD
    subgraph module[[module]]
        func1[Function 1]
    end`;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).toContain('subgraph module');
      expect(result).not.toContain('subgraph module[[module]]');
    });

    it('should fix subgraph with hexagon shape', () => {
      const code = `flowchart TD
    subgraph component{{component}}
        part1[Part 1]
    end`;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).toContain('subgraph component');
      expect(result).not.toContain('subgraph component{{component}}');
    });

    it('should fix multiple subgraphs with different shapes', () => {
      const code = `flowchart TD
    subgraph root[/root/]
        subgraph src[(src)]
            file1[file.js]
        end
        subgraph docs{{docs}}
            file2[readme.md]
        end
    end`;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).toContain('subgraph root');
      expect(result).toContain('subgraph src');
      expect(result).toContain('subgraph docs');
      expect(result).not.toContain('[/root/]');
      expect(result).not.toContain('[(src)]');
      expect(result).not.toContain('{{docs}}');
    });
  });

  describe('Whitespace Normalization', () => {
    it('should replace multiple spaces with single space', () => {
      const code = `flowchart TD
  A[Text    with     spaces] --> B`;
      
      const result = sanitizeMermaidCode(code);
      
      // Check that multiple consecutive non-newline spaces are reduced
      // Note: newlines are preserved, so we check within a single line
      const lines = result.split('\n');
      const labelLine = lines.find(l => l.includes('Text'));
      expect(labelLine).toBeDefined();
      expect(labelLine).not.toMatch(/[^\S\n]{2,}/); // No multiple non-newline spaces
      expect(result).toContain('Text with spaces');
    });

    it('should preserve newlines', () => {
      const code = `flowchart TD
  A --> B
  B --> C
  C --> D`;
      
      const result = sanitizeMermaidCode(code);
      
      const lines = result.split('\n');
      expect(lines.length).toBeGreaterThan(1);
    });

    it('should remove empty lines', () => {
      const code = `flowchart TD
  A --> B

  B --> C


  C --> D`;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).not.toMatch(/\n\s*\n\s*\n/);
    });

    it('should trim leading and trailing whitespace', () => {
      const code = `  
  flowchart TD
    A --> B
  `;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).toBe(result.trim());
      expect(result.startsWith('flowchart')).toBe(true);
    });
  });

  describe('Mixed Node Shape Fixing', () => {
    it('should fix [[text) pattern', () => {
      const code = `flowchart TD
  A[[Text) --> B`;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).toContain('A([Text])');
      expect(result).not.toContain('[[Text)');
    });

    it('should fix ([text]] pattern', () => {
      const code = `flowchart TD
  A([Text]] --> B`;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).toContain('A([Text])');
      expect(result).not.toContain('([Text]]');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string', () => {
      const result = sanitizeMermaidCode('');
      
      expect(result).toBe('');
    });

    it('should handle string with only whitespace', () => {
      const result = sanitizeMermaidCode('   \n  \n  ');
      
      expect(result).toBe('');
    });

    it('should handle code without any issues', () => {
      const code = `flowchart TD
  A --> B
  B --> C`;
      
      const result = sanitizeMermaidCode(code);
      
      expect(result).toContain('flowchart TD');
      expect(result).toContain('A --> B');
      expect(result).toContain('B --> C');
    });

    it('should handle complex diagram with multiple issues', () => {
      const code = `flowchart TD
  A[<b>Start</b>] <-- B["Text with (parens)"]
  B --> C{Decision}
  class A,B end
  C --> D[[Mixed]]`;
      
      const result = sanitizeMermaidCode(code);
      
      // Check HTML tags removed
      expect(result).not.toContain('<b>');
      expect(result).not.toContain('</b>');
      
      // Check reverse arrow fixed (becomes B["Text with - parens"] --> A[Start])
      expect(result).toContain('B["Text with - parens"] --> A[Start]');
      
      // Check quotes are preserved but parentheses are replaced
      expect(result).toContain('"');
      expect(result).not.toContain('(parens)');
      expect(result).toContain('- parens');
      
      // Check reserved keyword replaced
      expect(result).toContain('endStyle');
    });
  });
});
