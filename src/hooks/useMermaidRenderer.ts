import { useEffect, useState } from 'react';
import { renderDiagram } from '@/services/mermaid.service';
import { errorTrackingService } from '@/services/errorTracking.service';

export interface UseMermaidRendererResult {
  svg: string;
  error: string | null;
  isLoading: boolean;
}

export function useMermaidRenderer(code: string): UseMermaidRendererResult {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const render = async () => {
      if (!code || code.trim() === '') {
        setSvg('');
        setError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const renderedSvg = await renderDiagram(code);
        setSvg(renderedSvg);
        setError(null);
      } catch (err) {
        console.error('Mermaid render error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to render diagram';
        setError(errorMessage);
        setSvg('');
        
        // Log error for analysis
        errorTrackingService.logMermaidError({
          message: errorMessage,
          stack: err instanceof Error ? err.stack : undefined,
          diagramCode: code,
          metadata: {
            codeLength: code.length,
            timestamp: new Date().toISOString(),
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    render();
  }, [code]);

  return { svg, error, isLoading };
}
