/**
 * Invalid Mermaid diagram samples for testing
 */

export const INVALID_SYNTAX_MISSING_ARROW = `flowchart TD
  A B
  B --> C`;

export const INVALID_SYNTAX_UNCLOSED_BRACKET = `flowchart TD
  A[Unclosed bracket
  B --> C`;

export const INVALID_SYNTAX_WRONG_KEYWORD = `wrongchart TD
  A --> B`;

export const INVALID_YAML_FRONTMATTER = `---
title: My Diagram
---
flowchart TD
  A --> B`;

export const INVALID_HTML_TAGS = `flowchart TD
  A[<b>Bold Text</b>] --> B[<br/>Line Break]`;

export const INVALID_REVERSE_ARROW = `flowchart TD
  A <-- B
  B --> C`;

export const INVALID_RESERVED_KEYWORD_CLASS = `flowchart TD
  A --> B
  class A,B end`;

export const INVALID_MIXED_NODE_SHAPES = `flowchart TD
  A[[Text) --> B([Text]]`;

export const INVALID_EMPTY_DIAGRAM = ``;

export const INVALID_ONLY_WHITESPACE = `   
  
  `;

export const INVALID_MARKDOWN_SEPARATOR = `---
**Title:** Test
---`;

export const INVALID_JSON_BLOCK = `{
  "test": "data",
  "invalid": true
}`;

export const INVALID_PARENTHESES_IN_LABEL = `flowchart TD
  A[Function(param1, param2)] --> B`;

export const INVALID_QUOTES_IN_LABEL = `flowchart TD
  A["Quoted text"] --> B`;

export const INVALID_SPECIAL_CHARS = `flowchart TD
  A[Text with {braces}] --> B[Text with [brackets]]`;
