import toast from 'react-hot-toast';
import { useCallback } from 'react';
import { useDiagramStore } from '@/store/diagramStore';
import { useUIStore } from '@/store/uiStore';
import { useRenderStore } from '@/store/renderStore';
import {
  exportDiagramPng,
  exportDiagramSvg,
  exportDiagramsAsJson,
  downloadAllAsZip
} from '@/services/export.service';
import { mergeImportedDiagrams } from '@/services/import.service';
import type { Diagram } from '@/types/diagram.types';

export function useDiagramActions() {
  const {
    diagrams,
    addDiagram,
    updateDiagram,
    deleteDiagram,
    setAll,
    clearAll,
    filteredDiagrams
  } = useDiagramStore();
  const { setDiagramModal, setImportDialogOpen } = useUIStore();
  const { renders } = useRenderStore();

  const handleCreate = useCallback(() => {
    setDiagramModal(true, null);
  }, [setDiagramModal]);

  const handleEdit = useCallback(
    (diagramId: string) => {
      setDiagramModal(true, diagramId);
    },
    [setDiagramModal]
  );

  const handleDelete = useCallback(
    (diagramId: string) => {
      deleteDiagram(diagramId);
      toast.success('Diagram deleted');
    },
    [deleteDiagram]
  );

  const handleExportJson = useCallback(() => {
    exportDiagramsAsJson(diagrams);
    toast.success('Exported diagrams to JSON');
  }, [diagrams]);

  const handleExportSvg = useCallback(
    async (diagram: Diagram) => {
      const svg = renders[diagram.name];
      if (!svg) {
        toast.error('Diagram not rendered yet');
        return;
      }
      exportDiagramSvg(diagram, svg);
      toast.success('SVG exported');
    },
    [renders]
  );

  const handleExportPng = useCallback(
    async (diagram: Diagram) => {
      const svg = renders[diagram.name];
      if (!svg) {
        toast.error('Diagram not rendered yet');
        return;
      }
      try {
        await exportDiagramPng(diagram, svg);
        toast.success('PNG exported');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to export PNG');
      }
    },
    [renders]
  );

  const handleDownloadZip = useCallback(async () => {
    await downloadAllAsZip(diagrams, renders);
    toast.success('ZIP download ready');
  }, [diagrams, renders]);

  const handleOpenImport = useCallback(() => {
    setImportDialogOpen(true);
  }, [setImportDialogOpen]);

  const handleClearAll = useCallback(() => {
    clearAll();
    toast.success('All diagrams cleared');
  }, [clearAll]);

  const handleMergeImported = useCallback(
    (imported: Diagram[]) => {
      const result = mergeImportedDiagrams(diagrams, imported);
      setAll(result.diagrams);
      const parts = [`Imported ${result.imported} diagram(s)`];
      if (result.replaced) parts.push(`replaced ${result.replaced}`);
      if (result.skipped) parts.push(`skipped ${result.skipped}`);
      toast.success(parts.join(', '));
    },
    [diagrams, setAll]
  );

  return {
    diagrams,
    filteredDiagrams,
    handleCreate,
    handleEdit,
    handleDelete,
    handleExportJson,
    handleExportSvg,
    handleExportPng,
    handleDownloadZip,
    handleOpenImport,
    handleClearAll,
    handleMergeImported
  };
}
