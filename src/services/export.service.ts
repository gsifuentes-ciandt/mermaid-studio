import JSZip from 'jszip';
import type { Diagram } from '@/types/diagram.types';

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportDiagramsAsJson(diagrams: Diagram[]): void {
  const blob = new Blob([JSON.stringify(diagrams, null, 2)], {
    type: 'application/json'
  });
  downloadBlob(blob, 'mermaid-diagrams-pro.json');
}

export function exportDiagramSvg(diagram: Diagram, svg: string): void {
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  downloadBlob(blob, `${diagram.name || 'diagram'}.svg`);
}

export async function exportDiagramPng(diagram: Diagram, svg: string): Promise<void> {
  // Parse SVG to get dimensions
  const svgElement = new DOMParser().parseFromString(svg, 'image/svg+xml').documentElement as unknown as SVGSVGElement;
  const width = Number(svgElement.getAttribute('width')) || svgElement.viewBox?.baseVal?.width || 800;
  const height = Number(svgElement.getAttribute('height')) || svgElement.viewBox?.baseVal?.height || 600;

  // Create canvas
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas context unavailable');

  // Set canvas size with device pixel ratio for high quality
  const scale = 2; // Use 2x for better quality
  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  // Scale context and fill white background
  context.scale(scale, scale);
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);

  // Convert SVG to data URL (avoids CORS issues)
  const svgData = encodeURIComponent(svg);
  const dataUrl = `data:image/svg+xml;charset=utf-8,${svgData}`;

  // Load and draw image
  const image = new Image();
  
  await new Promise<void>((resolve, reject) => {
    image.onload = () => {
      try {
        context.drawImage(image, 0, 0, width, height);
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    image.onerror = (error) => reject(error);
    image.src = dataUrl;
  });

  // Convert canvas to blob and download
  await new Promise<void>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        downloadBlob(blob, `${diagram.name || 'diagram'}.png`);
        resolve();
      } else {
        reject(new Error('Failed to create blob'));
      }
    }, 'image/png', 1.0);
  });
}

export async function downloadAllAsZip(
  diagrams: Diagram[],
  renderMap: Record<string, string>
): Promise<void> {
  const zip = new JSZip();

  diagrams.forEach((diagram) => {
    const svg = renderMap[diagram.name];
    if (svg) {
      zip.file(`${diagram.name || 'diagram'}.svg`, svg);
    }
  });

  zip.file('diagrams.json', JSON.stringify(diagrams, null, 2));

  const content = await zip.generateAsync({ type: 'blob' });
  downloadBlob(content, 'mermaid-diagrams-pro.zip');
}

// Alias for compatibility
export const exportToJSON = exportDiagramsAsJson;
export const exportAllToZip = async (diagrams: Diagram[]): Promise<void> => {
  // For now, export without SVGs - will be enhanced later
  const zip = new JSZip();
  zip.file('diagrams.json', JSON.stringify(diagrams, null, 2));
  const content = await zip.generateAsync({ type: 'blob' });
  downloadBlob(content, 'mermaid-diagrams-pro.zip');
};
