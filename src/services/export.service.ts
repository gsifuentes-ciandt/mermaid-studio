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
  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const image = new Image();
  image.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve();
    };
    image.onerror = (error) => reject(error);
    image.src = url;
  });

  const svgElement = new DOMParser().parseFromString(svg, 'image/svg+xml').documentElement as unknown as SVGSVGElement;
  const width = Number(svgElement.getAttribute('width')) || svgElement.viewBox?.baseVal?.width || 800;
  const height = Number(svgElement.getAttribute('height')) || svgElement.viewBox?.baseVal?.height || 600;

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas context unavailable');

  const scale = window.devicePixelRatio || 1;
  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  context.scale(scale, scale);
  context.clearRect(0, 0, width, height);
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  await new Promise<void>((resolve) =>
    canvas.toBlob((blob) => {
      if (blob) {
        downloadBlob(blob, `${diagram.name || 'diagram'}.png`);
      }
      resolve();
    }, 'image/png')
  );
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
