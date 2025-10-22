import mermaid from 'mermaid';

/**
 * Decode HTML entities
 */
function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
  };
  
  return text.replace(/&[a-z]+;|&#\d+;/gi, (match) => entities[match] || match);
}

/**
 * Sanitize Mermaid code by removing HTML tags and invalid characters
 */
export function sanitizeMermaidCode(code: string): string {
  // Fix reverse arrows FIRST before any other processing
  // Replace <-- with --> and flip the direction
  // Match: NodeA[label] <-- NodeB[label] or just NodeA <-- NodeB
  let sanitized = code.replace(/(\w+(?:\[[^\]]*\])?)\s*<--\s*(\w+(?:\[[^\]]*\])?)/g, '$2 --> $1');
  
  // Remove invalid YAML-style config blocks (AI sometimes generates these)
  // WRONG: ---\nconfig:\n  themeVariables:\n    htmlLabels: false\n---
  // These are not valid Mermaid syntax and cause parse errors
  // Match everything between --- delimiters and remove it
  sanitized = sanitized.replace(/^---\s*\n[\s\S]*?\n---\s*\n/gm, '');
  // Also remove standalone config/Note over lines
  sanitized = sanitized.replace(/^(?:config|Note over).*$/gm, '');
  
  // Fix invalid subgraph syntax with special node shapes
  // WRONG: subgraph folder[/folder/] or subgraph name[(text)] or subgraph id{{text}}
  // CORRECT: subgraph folder or subgraph "folder"
  // Match: subgraph followed by ID and special shape characters [/, [(, [[, {{, etc.
  sanitized = sanitized.replace(/subgraph\s+(\w+)[\[\({][^\]\)}]*[\]\)}]/g, 'subgraph $1');
  
  // Replace <br/> with space to avoid parse errors
  sanitized = sanitized.replace(/<br\s*\/?>/gi, ' ');
  
  // Remove other HTML tags (e.g., <b>, </b>, <i>, etc.)
  // Match HTML tags: < followed by letter/slash, then anything, then >
  sanitized = sanitized.replace(/<\/?[a-zA-Z][^>]*>/g, '');
  
  // Fix mixed node shape syntax (e.g., [[text]) or ([text]]) or double brackets ]]
  // Match: NodeID[[text) and replace with NodeID([text])
  sanitized = sanitized.replace(/(\w+)\[\[(.*?)\)/g, '$1([$2])');
  // Match: NodeID([text]] and replace with NodeID([text])
  sanitized = sanitized.replace(/(\w+)\(\[(.*?)\]\]/g, '$1([$2])');
  // Fix double closing brackets: NodeID[text]] -> NodeID[text]
  sanitized = sanitized.replace(/(\w+\[[^\]]+)\]\]/g, '$1]');
  
  // CRITICAL FIX: Clean node labels while preserving JSON-like syntax
  // Mermaid interprets (), [], {}, "" as shape delimiters
  // Strategy: Keep curly braces for JSON structure, but remove quotes inside them
  sanitized = sanitized.replace(/(\w+)\[([^\]]+)\]/g, (match, nodeId, label) => {
    let cleanLabel = label;
    
    // Remove quotes from inside curly braces: {status:400, error:"text"} -> {status:400, error:text}
    cleanLabel = cleanLabel.replace(/\{([^}]+)\}/g, (_braceMatch: string, braceContent: string) => {
      const withoutQuotes = braceContent.replace(/["']/g, '');
      return `{${withoutQuotes}}`;
    });
    
    cleanLabel = cleanLabel
      .replace(/\\n/g, ' ') // Remove literal \n escape sequences (causes parse errors)
      .replace(/\\r/g, ' ') // Remove literal \r escape sequences
      .replace(/\\t/g, ' ') // Remove literal \t escape sequences
      .replace(/\|/g, '/') // Replace pipes with forward slash (true|false -> true/false)
      .replace(/\(([^)]+)\)/g, '- $1') // Replace (text) with - text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    return `${nodeId}[${cleanLabel}]`;
  });
  
  // Also clean decision node labels (diamond shapes with {})
  sanitized = sanitized.replace(/(\w+)\{([^\}]+)\}/g, (match, nodeId, label) => {
    // Replace pipe characters in decision labels
    const cleanLabel = label
      .replace(/\\n/g, ' ') // Remove literal \n escape sequences
      .replace(/\\r/g, ' ') // Remove literal \r escape sequences
      .replace(/\\t/g, ' ') // Remove literal \t escape sequences
      .replace(/\|/g, '/') // Replace pipes with forward slash
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    return `${nodeId}{${cleanLabel}}`;
  });
  
  // Fix incorrect class syntax: "NodeA,NodeB class myClass" -> "class NodeA,NodeB myClass"
  // AI sometimes puts the keyword 'class' after the node list instead of before
  // Use [ \t] instead of \s to avoid matching newlines
  sanitized = sanitized.replace(/^([ \t]*)([A-Za-z0-9_,]+(?:[ \t]+[A-Za-z0-9_,]+)*)[ \t]+class[ \t]+([A-Za-z0-9_]+)/gm, '$1class $2 $3');
  
  // Replace reserved keywords in CSS class names (:::keyword)
  // Keywords like 'end', 'else', 'alt', 'loop' are reserved in Mermaid
  const reservedKeywords = ['end', 'else', 'alt', 'loop', 'opt', 'par', 'and', 'note'];
  reservedKeywords.forEach(keyword => {
    // Replace :::keyword with :::keywordStyle
    const classUsageRegex = new RegExp(`:::${keyword}\\b`, 'g');
    sanitized = sanitized.replace(classUsageRegex, `:::${keyword}Style`);
    
    // Replace classDef keyword with classDef keywordStyle
    const classDefRegex = new RegExp(`classDef\\s+${keyword}\\b`, 'g');
    sanitized = sanitized.replace(classDefRegex, `classDef ${keyword}Style`);
    
    // Replace class ... keyword with class ... keywordStyle (with or without semicolon)
    // Match keyword at the end: "class A,B end" or "class A,B end;" or "class C loop"
    const classAssignEndRegex = new RegExp(`(class\\s+[^;\\n]+)\\s+${keyword}\\b`, 'g');
    sanitized = sanitized.replace(classAssignEndRegex, `$1 ${keyword}Style`);
    
    // Also handle keyword in the middle: "class end,A,B;" -> "class endStyle,A,B;"
    const classAssignStartRegex = new RegExp(`(class\\s+)${keyword}(\\s*[,;])`, 'g');
    sanitized = sanitized.replace(classAssignStartRegex, `$1${keyword}Style$2`);
    
    // Handle keyword as class name after node: "class C loop" -> "class C loopStyle"
    const classNodeKeywordRegex = new RegExp(`(class\\s+\\w+)\\s+${keyword}\\b`, 'g');
    sanitized = sanitized.replace(classNodeKeywordRegex, `$1 ${keyword}Style`);
  });
  
  // Fix sequence diagram notes: "Participant: Text" -> "Note over Participant: Text"
  // This is a common AI mistake in sequence diagrams
  sanitized = sanitized.replace(/^\s*(\w+):\s+([^->\n]+)$/gm, 'Note over $1: $2');
  
  // Fix state diagram notes that repeat the state name
  // "note right of StateName\n  StateName may be..." -> "note right of StateName\n  May be..."
  sanitized = sanitized.replace(/^(\s*note\s+(?:right|left)\s+of\s+)(\w+)\s*\n\s*\2\s+/gm, '$1$2\n  ');
  
  // Fix nested state blocks that create cycles (e.g., state Initiated { Initiated --> ... })
  // This happens when AI creates a state block with the same name as a transition inside it
  // Pattern: state StateName { StateName --> ... } should become state StateName { [*] --> ... }
  sanitized = sanitized.replace(/state\s+(\w+)\s*\{[^}]*?\1\s*-->/g, (match, stateName) => {
    return match.replace(new RegExp(`\\b${stateName}\\s*-->`, 'g'), '[*] -->');
  });
  
  // Remove parentheses from edge labels: -->|Text (with parens)| becomes -->|Text with parens|
  // Parentheses in edge labels cause parse errors
  sanitized = sanitized.replace(/(\|[^|]+)\([^)]*\)([^|]*\|)/g, '$1$2');
  
  // Replace multiple spaces (but NOT newlines) with single space
  // This preserves line structure which is critical for Mermaid
  sanitized = sanitized.replace(/[^\S\n]+/g, ' ');
  
  // Remove empty lines (multiple consecutive newlines)
  sanitized = sanitized.replace(/\n\s*\n/g, '\n');
  
  return sanitized.trim();
}

/**
 * Extract Mermaid code from AI response
 */
export function extractMermaidCode(content: string): string {
  // ULTIMATE STRATEGY: Find ``` then find diagram keyword, capture until closing ```
  // This is foolproof because we look inside code blocks only
  
  const diagramKeywords = 'flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|journey|gitGraph|mindmap|timeline|quadrantChart|requirementDiagram|C4Context';
  
  // Strategy 1: Find all code blocks - capture language specifier AND content
  const codeBlockRegex = /```([^\n]*)\n([\s\S]*?)```/g;
  const matches = Array.from(content.matchAll(codeBlockRegex));
  
  console.log(`🔍 Strategy 1: Found ${matches.length} code blocks`);
  
  for (let i = 0; i < matches.length; i++) {
    const languageSpec = matches[i][1].trim();
    const blockContent = matches[i][2];
    
    console.log(`📦 Block ${i + 1} language: "${languageSpec}"`);
    console.log(`📦 Block ${i + 1} first 100 chars:`, blockContent.substring(0, 100));
    
    // Check if language specifier contains diagram keyword (e.g., ```flowchart TD)
    const langDiagramRegex = new RegExp(`^(${diagramKeywords})`, 'i');
    const langMatch = languageSpec.match(langDiagramRegex);
    
    if (langMatch) {
      // Diagram keyword is in language specifier - prepend it to content
      console.log(`✅ Block ${i + 1} has diagram keyword in language spec: ${langMatch[1]}`);
      let code = languageSpec + '\n' + blockContent;
      code = code.trim();
      
      console.log(`🎯 Extracted code length: ${code.length}`);
      return sanitizeMermaidCode(code);
    }
    
    // Check if block content starts with diagram keyword
    const contentDiagramRegex = new RegExp(`^\\s*(${diagramKeywords})\\s`, 'im');
    if (contentDiagramRegex.test(blockContent)) {
      console.log(`✅ Block ${i + 1} contains diagram keyword in content!`);
      
      // Simply return the entire block content since it starts with diagram keyword
      let code = blockContent.trim();
      
      // Fix direction on separate line
      if (/^(TD|LR|TB|RL|BT)\s*$/m.test(code.split('\n')[0])) {
        code = 'flowchart ' + code;
      }
      
      console.log(`🎯 Extracted code length: ${code.length}`);
      console.log(`🎯 First 100 chars: ${code.substring(0, 100)}`);
      return sanitizeMermaidCode(code);
    } else {
      console.log(`❌ Block ${i + 1} does NOT contain diagram keyword`);
    }
  }
  
  // Strategy 2: Find all code blocks and use the last one
  // Only match blocks with mermaid/flowchart/graph language specifier
  const allCodeBlocks = content.matchAll(/```(?:mermaid|flowchart|graph)\s*\r?\n([\s\S]*?)\r?\n```/g);
  const blocks = Array.from(allCodeBlocks);
  
  console.log(`📦 Strategy 2: Found ${blocks.length} mermaid/flowchart/graph code blocks`);
  
  if (blocks.length > 0) {
    const lastBlock = blocks[blocks.length - 1];
    let code = lastBlock[1].trim();
    
    console.log(`📦 Strategy 2: Extracted code from last block (${code.length} chars)`);
    console.log(`📦 Strategy 2: First 100 chars:`, code.substring(0, 100));
    
    // Verify it looks like Mermaid code (not markdown or other content)
    // Reject if it starts with markdown syntax like ---, **, #, etc.
    if (/^(---|[*#]|\*\*|__)/m.test(code)) {
      console.log('⚠️ Strategy 2: Rejected code block - starts with markdown syntax');
    } else {
      // Fix direction on separate line
      if (/^(TD|LR|TB|RL|BT)\s*$/m.test(code.split('\n')[0])) {
        code = 'flowchart ' + code;
      }
      
      console.log('✅ Strategy 2: Returning code');
      return sanitizeMermaidCode(code);
    }
  }
  
  // Strategy 3: If no code block, try to find mermaid syntax directly in text
  console.log('📦 Strategy 3: Searching for Mermaid keywords in text');
  const lines = content.split('\n');
  const mermaidStart = lines.findIndex(line => 
    /^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|journey|gitGraph|mindmap|timeline|quadrantChart|requirementDiagram|C4Context)/i.test(line.trim())
  );
  
  if (mermaidStart !== -1) {
    console.log(`📦 Strategy 3: Found Mermaid keyword at line ${mermaidStart}`);
    // Find the end (stop at ``` or end of content)
    let mermaidEnd = lines.length;
    for (let i = mermaidStart + 1; i < lines.length; i++) {
      if (lines[i].trim() === '```') {
        mermaidEnd = i;
        break;
      }
    }
    const extracted = lines.slice(mermaidStart, mermaidEnd).join('\n').trim();
    console.log(`✅ Strategy 3: Returning code (${extracted.length} chars)`);
    return sanitizeMermaidCode(extracted);
  }
  
  // Last resort: try to decode if it looks like encoded content
  const decoded = content.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
  const trimmed = decoded.trim();
  if (/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|journey|gitGraph|mindmap|timeline|quadrantChart|requirementDiagram|C4Context)/i.test(trimmed)) {
    return sanitizeMermaidCode(trimmed);
  }
  
  // No Mermaid code found - return empty string
  // This allows AI to respond with explanations only
  console.log('⚠️ No Mermaid code found in response');
  return '';
}

/**
 * Check if extracted code is valid Mermaid (not markdown or other content)
 */
function isValidMermaidCode(code: string): boolean {
  if (!code || code.trim().length === 0) return false;
  
  // Reject if starts with markdown syntax
  if (/^(---|[*#]|\*\*|__|>|-)/.test(code.trim())) {
    console.log('⚠️ Rejected: starts with markdown syntax');
    return false;
  }
  
  // Must start with a Mermaid keyword
  const diagramKeywords = /^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|journey|gitGraph|mindmap|timeline|quadrantChart|requirementDiagram|C4Context)/i;
  if (!diagramKeywords.test(code.trim())) {
    console.log('⚠️ Rejected: does not start with Mermaid keyword');
    return false;
  }
  
  return true;
}

/**
 * Extract title from AI response
 */
export function extractTitle(content: string): string | undefined {
  const titleMatch = content.match(/^Title:\s*(.+)$/m);
  return titleMatch ? titleMatch[1].trim() : undefined;
}

/**
 * Extract description from AI response
 */
export function extractDescription(content: string): string | undefined {
  const descMatch = content.match(/^Description:\s*(.+)$/m);
  return descMatch ? descMatch[1].trim() : undefined;
}

/**
 * Extract explanation text from AI response (text after code block)
 */
export function extractExplanation(content: string): string {
  // Remove title and description lines
  let cleaned = content.replace(/^Title:\s*.+$/m, '');
  cleaned = cleaned.replace(/^Description:\s*.+$/m, '');
  
  // Remove code blocks
  cleaned = cleaned.replace(/```(?:mermaid)?\s*\n[\s\S]*?```/g, '');
  
  // Clean up the remaining text
  cleaned = cleaned
    .trim()
    .replace(/^---+\s*/gm, '') // Remove horizontal rules
    .replace(/^\*\*.*?\*\*:?\s*/gm, '') // Remove bold headers
    .replace(/^#+\s+/gm, '') // Remove markdown headers
    .trim();
  
  // If there's meaningful text, return it
  if (cleaned.length > 20 && cleaned.length < 500) {
    return cleaned;
  }
  
  // Otherwise return a generic message
  return 'AI-generated diagram based on your request.';
}

/**
 * Validate Mermaid syntax
 */
export async function validateMermaidSyntax(code: string): Promise<{ isValid: boolean; error?: string }> {
  // Check for empty or whitespace-only code
  if (!code || code.trim().length === 0) {
    return {
      isValid: false,
      error: 'Diagram code is empty'
    };
  }
  
  try {
    await mermaid.parse(code);
    return { isValid: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Invalid Mermaid syntax:', errorMessage);
    return {
      isValid: false,
      error: errorMessage
    };
  }
}

/**
 * Sanitize user input
 */
export function sanitizePrompt(prompt: string): string {
  return prompt
    .trim()
    .slice(0, 2000) // Max length
    .replace(/[<>]/g, ''); // Remove potential HTML
}

/**
 * Calculate token count (rough estimate)
 */
export function estimateTokenCount(text: string): number {
  // Rough estimate: ~4 characters per token
  return Math.ceil(text.length / 4);
}

/**
 * Extract HTTP Method from AI response
 */
export function extractHttpMethod(content: string): string | undefined {
  // Try "HTTP Method: POST" format
  let match = content.match(/HTTP\s+Method:\s*([A-Z]+)/i);
  if (match) return match[1].toUpperCase();
  
  // Try "Endpoint: POST /path" format
  match = content.match(/Endpoint:\s*([A-Z]+)\s+\/[^\n]*/i);
  if (match) return match[1].toUpperCase();
  
  return undefined;
}

/**
 * Extract Endpoint Path from AI response
 */
export function extractEndpointPath(content: string): string | undefined {
  // Try "Endpoint Path: /path" format
  let match = content.match(/Endpoint\s+Path:\s*([^\n]+)/i);
  if (match) return match[1].trim();
  
  // Try "Endpoint: POST /path" format
  match = content.match(/Endpoint:\s*[A-Z]+\s+(\/[^\n\s]+)/i);
  if (match) return match[1].trim();
  
  return undefined;
}

/**
 * Extract Request Payloads from AI response
 */
export function extractRequestPayloads(content: string): Array<{ status: string; contentType: string; json: string }> {
  const payloads: Array<{ status: string; contentType: string; json: string }> = [];
  
  // Match Request Payload sections with flexible format (with or without bullets)
  // Matches: "Request Payload:" followed by "Status:" or "- Status:", "Content-Type:" or "- Content-Type:", optionally "JSON:" or "- JSON Example:"
  const requestRegex = /Request Payload[:\s]*[\s\S]*?-?\s*\*?\*?Status:\*?\*?\s*([^\n]+)[\s\S]*?-?\s*\*?\*?Content-Type:\*?\*?\s*([^\n]+)(?:[\s\S]*?(?:-?\s*\*?\*?JSON(?:\s+Example)?:\*?\*?\s*```json\s*([\s\S]*?)```))?/gi;
  let match;
  
  while ((match = requestRegex.exec(content)) !== null) {
    payloads.push({
      status: match[1]?.trim() || 'Request Body',
      contentType: match[2]?.trim() || 'application/json',
      json: match[3]?.trim() || ''
    });
  }
  
  return payloads;
}

/**
 * Extract Response Payloads from AI response
 */
export function extractResponsePayloads(content: string): Array<{ status: string; contentType: string; json: string }> {
  const payloads: Array<{ status: string; contentType: string; json: string }> = [];
  
  // Match Response Payload sections with status codes (with or without bullets)
  // Matches: "Response Payload (200):" followed by "Status:" or "- Status:", "Content-Type:" or "- Content-Type:", optionally "JSON:" or "- JSON Example:"
  const responseRegex = /Response Payload\s*\((\d+)\)[:\s]*[\s\S]*?-?\s*\*?\*?Status:\*?\*?\s*\d+[\s\S]*?-?\s*\*?\*?Content-Type:\*?\*?\s*([^\n]+)(?:[\s\S]*?(?:-?\s*\*?\*?JSON(?:\s+Example)?:\*?\*?\s*```json\s*([\s\S]*?)```))?/gi;
  let match;
  
  while ((match = responseRegex.exec(content)) !== null) {
    payloads.push({
      status: match[1]?.trim() || '200',
      contentType: match[2]?.trim() || 'application/json',
      json: match[3]?.trim() || ''
    });
  }
  
  return payloads;
}

/**
 * Extract Workflow Actors from AI response
 * Also handles "Endpoint Actors" as AI sometimes uses wrong field names
 */
export function extractWorkflowActors(content: string): string | undefined {
  // Try "Workflow Actors" first, then "Endpoint Actors" as fallback
  let match = content.match(/Workflow\s+Actors:\s*([^\n]+)/i);
  if (!match) {
    match = content.match(/Endpoint\s+Actors:\s*([^\n]+)/i);
  }
  return match ? match[1].trim() : undefined;
}

/**
 * Extract Workflow Trigger from AI response
 * Also handles "Endpoint Trigger" as AI sometimes uses wrong field names
 */
export function extractWorkflowTrigger(content: string): string | undefined {
  // Try "Workflow Trigger" first, then "Endpoint Trigger" as fallback
  let match = content.match(/Workflow\s+Trigger:\s*([^\n]+)/i);
  if (!match) {
    match = content.match(/Endpoint\s+Trigger:\s*([^\n]+)/i);
  }
  return match ? match[1].trim() : undefined;
}

/**
 * Extract Diagram Type from AI response
 */
export function extractDiagramType(content: string): string | undefined {
  const match = content.match(/Diagram\s+Type:\s*(workflow|endpoint|sequence|architecture|state(?:\s+machine)?|other)/i);
  if (!match) return undefined;
  
  // Normalize "state machine" to "state"
  const type = match[1].toLowerCase().replace(/\s+machine/, '');
  return type;
}
