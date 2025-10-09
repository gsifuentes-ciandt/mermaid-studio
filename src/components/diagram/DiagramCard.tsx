import { Edit, Trash2, Info, Download, ZoomIn } from 'lucide-react';
import { useState } from 'react';
import type { Diagram } from '@/types/diagram.types';
import { useDiagramStore } from '@/store/diagramStore';
import { useUIStore } from '@/store/uiStore';
import { useMermaidRenderer } from '@/hooks/useMermaidRenderer';
import { exportDiagramSvg, exportDiagramPng } from '@/services/export.service';
import toast from 'react-hot-toast';

interface DiagramCardProps {
  diagram: Diagram;
}

const typeColors: Record<string, string> = {
  workflow: 'bg-blue-100 text-blue-800',
  endpoint: 'bg-green-100 text-green-800',
  architecture: 'bg-yellow-100 text-yellow-800',
  sequence: 'bg-pink-100 text-pink-800',
  state: 'bg-indigo-100 text-indigo-800',
  other: 'bg-gray-100 text-gray-800'
};

export function DiagramCard({ diagram }: DiagramCardProps): JSX.Element {
  const deleteDiagram = useDiagramStore((state) => state.deleteDiagram);
  const openDiagramModal = useUIStore((state) => state.openDiagramModal);
  const openInfoModal = useUIStore((state) => state.openInfoModal);
  const openZoomModal = useUIStore((state) => state.openZoomModal);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const { svg, error, isLoading } = useMermaidRenderer(diagram.code);

  const handleEdit = () => {
    openDiagramModal(diagram.name);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${diagram.title}"?`)) {
      deleteDiagram(diagram.name);
      toast.success('Diagram deleted');
    }
  };

  const handleInfo = () => {
    openInfoModal(diagram.name);
  };

  const handleZoom = () => {
    openZoomModal(diagram.name);
  };

  const handleExportSVG = () => {
    if (svg) {
      exportDiagramSvg(diagram, svg);
      toast.success('Exported as SVG');
      setShowExportMenu(false);
    }
  };

  const handleExportPNG = async () => {
    if (svg) {
      try {
        await exportDiagramPng(diagram, svg);
        toast.success('Exported as PNG');
        setShowExportMenu(false);
      } catch (error) {
        toast.error('Failed to export PNG');
        console.error(error);
      }
    }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800 dark:shadow-gray-900/50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold uppercase ${
                  typeColors[diagram.type] || typeColors.other
                }`}
              >
                {diagram.type}
              </span>
            </div>
            <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white" title={diagram.title}>
              {diagram.title}
            </h3>
            {diagram.description && (
              <p className="mt-1 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">{diagram.description}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 grid grid-cols-4 gap-2">
          <button
            onClick={handleEdit}
            className="flex items-center justify-center rounded-lg border-2 border-amber-500 bg-white p-2 text-amber-500 transition hover:bg-amber-50 dark:bg-gray-800 dark:hover:bg-amber-950"
            title="Edit Diagram"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center rounded-lg border-2 border-red-500 bg-white p-2 text-red-500 transition hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-950"
            title="Delete Diagram"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={handleInfo}
            className="flex items-center justify-center rounded-lg border-2 border-blue-500 bg-white p-2 text-blue-500 transition hover:bg-blue-50 dark:bg-gray-800 dark:hover:bg-blue-950"
            title="View Info"
          >
            <Info size={18} />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex w-full items-center justify-center rounded-lg border-2 border-green-500 bg-white p-2 text-green-500 transition hover:bg-green-50 dark:bg-gray-800 dark:hover:bg-green-950"
              title="Export"
            >
              <Download size={18} />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 top-full z-10 mt-2 w-32 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <button
                  onClick={handleExportSVG}
                  className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  Export SVG
                </button>
                <button
                  onClick={handleExportPNG}
                  className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  Export PNG
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div
        className="flex flex-1 cursor-pointer items-center justify-center bg-white p-4 dark:bg-gray-800"
        onClick={handleZoom}
        title="Click to zoom"
      >
        {isLoading && (
          <div className="text-sm text-gray-500 dark:text-gray-400">Loading diagram...</div>
        )}
        {error && (
          <div className="text-center">
            <div className="text-sm text-red-600 dark:text-red-400">Failed to render</div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{error}</div>
          </div>
        )}
        {svg && !isLoading && !error && (
          <div className="max-h-64 overflow-hidden rounded bg-white p-2">
            <div dangerouslySetInnerHTML={{ __html: svg }} />
          </div>
        )}
      </div>
    </div>
  );
}
