import mermaid from 'mermaid';

let initialized = false;

function ensureInitialized(): void {
  if (initialized) return;
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: 'default',
    themeVariables: {
      fontSize: '20px',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif'
    },
    sequence: {
      actorFontSize: '18px',
      noteFontSize: '16px',
      messageFontSize: '16px',
      width: 200,
      height: 70,
      boxMargin: 15,
      noteMargin: 15,
      messageMargin: 50,
      diagramMarginX: 30,
      diagramMarginY: 15
    },
    flowchart: {
      htmlLabels: true,
      curve: 'basis',
      padding: 20
    }
  });
  initialized = true;
}

export async function renderMermaid(code: string): Promise<string> {
  ensureInitialized();
  const uniqueId = `mermaid-${Math.random().toString(36).slice(2, 11)}`;
  const { svg } = await mermaid.render(uniqueId, code);
  return svg;
}

export async function tryRenderMermaid(code: string): Promise<{ svg?: string; error?: string }>
{
  try {
    const svg = await renderMermaid(code);
    return { svg };
  } catch (error) {
    console.error('Failed to render mermaid diagram', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Alias for compatibility
export const renderDiagram = renderMermaid;
