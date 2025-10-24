import { Edit, Trash2, Info, Download, ZoomIn, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { Diagram } from '@/types/diagram.types';
import { useDiagramStore } from '@/store/diagramStore';
import { useUIStore } from '@/store/uiStore';
import { useAIStore } from '@/store/aiStore';
import { useMermaidRenderer } from '@/hooks/useMermaidRenderer';
import { useProjectPermissions } from '@/hooks/useProjectPermissions';
import { exportDiagramSvg, exportDiagramPng } from '@/services/export.service';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useI18n } from '@/contexts/I18nContext';
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
  const { t } = useI18n();
  const permissions = useProjectPermissions();
  const deleteDiagram = useDiagramStore((state) => state.deleteDiagram);
  const openDiagramModal = useUIStore((state) => state.openDiagramModal);
  const openInfoModal = useUIStore((state) => state.openInfoModal);
  const openZoomModal = useUIStore((state) => state.openZoomModal);
  const { open: openAI, setContextDiagram } = useAIStore();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { svg, error, isLoading } = useMermaidRenderer(diagram.code);

  const handleEdit = () => {
    openDiagramModal(diagram.name);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteDiagram(diagram.name);
    toast.success('Diagram deleted');
  };

  const handleInfo = () => {
    openInfoModal(diagram.name);
  };

  const handleZoom = () => {
    openZoomModal(diagram.name);
  };

  const handleAIEdit = () => {
    setContextDiagram({
      name: diagram.name,
      title: diagram.title,
      code: diagram.code,
      type: diagram.type,
    });
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
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 min-w-0 max-w-full">
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
            {/* Timestamps */}
            <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
              <span title={`Created: ${new Date(diagram.createdAt).toLocaleString()}`}>
                📅 {new Date(diagram.createdAt).toLocaleDateString()}
              </span>
              <span title={`Updated: ${new Date(diagram.updatedAt).toLocaleString()}`}>
                🔄 {new Date(diagram.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview with Floating Buttons */}
      <div className="relative flex flex-1 items-center justify-center bg-white p-4 dark:bg-gray-800">
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
          <>
            {/* Diagram Preview - Clickable with hover effect */}
            <div 
              onClick={handleZoom}
              className="max-h-96 overflow-hidden rounded bg-white p-2 cursor-pointer transition-transform hover:scale-105"
              title="Click to zoom"
            >
              <div 
                className="flex items-center justify-center"
                style={{ minHeight: '200px' }}
                dangerouslySetInnerHTML={{ __html: svg }} 
              />
            </div>
            
            {/* Floating Action Button - Top Left: Delete (Dangerous Action) - Only for editors/admins/owners */}
            {permissions.canDeleteDiagram && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="absolute top-3 left-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-red-500/80 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-red-500 hover:scale-110 group-hover:opacity-100 opacity-60"
                title="Delete Diagram"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}

            {/* Floating Action Buttons - Top Right: Edit, Info */}
            <div className="absolute top-3 right-3 z-10 flex gap-2">
              {permissions.canEditDiagram && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit();
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/80 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-amber-500 hover:scale-110 group-hover:opacity-100 opacity-60"
                  title="Edit Diagram"
                >
                  <Edit className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleInfo();
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/80 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-blue-500 hover:scale-110 group-hover:opacity-100 opacity-60"
                title="View Info"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>

            {/* Floating Action Buttons - Bottom Left: Export */}
            <div className="absolute bottom-3 left-3 z-10">
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowExportMenu(!showExportMenu);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/80 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-green-500 hover:scale-110 group-hover:opacity-100 opacity-60"
                  title="Export"
                >
                  <Download className="h-5 w-5" />
                </button>
                {showExportMenu && (
                  <div className="absolute bottom-full left-0 mb-2 w-36 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportSVG();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    >
                      Export SVG
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportPNG();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    >
                      Export PNG
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* AI Edit Button - Bottom Right - Only for editors/admins/owners */}
            {permissions.canEditDiagram && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAIEdit();
                }}
                className="absolute bottom-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl group-hover:opacity-100 opacity-60"
                title="Edit with AI"
              >
                <Sparkles className="h-5 w-5" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title={t('modal.delete.title')}
        message={t('modal.delete.message').replace('{title}', diagram.title)}
        confirmText={t('modal.delete.confirm')}
        cancelText={t('modal.delete.cancel')}
        variant="danger"
      />
    </div>
  );
}
