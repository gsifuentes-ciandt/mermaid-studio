import { Plus, Upload, Download, Trash2, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useDiagramStore } from '@/store/diagramStore';
import { useUIStore } from '@/store/uiStore';
import { useI18n } from '@/contexts/I18nContext';
import { exportToJSON } from '@/services/export.service';
import { importFromJSON } from '@/services/import.service';
import toast from 'react-hot-toast';

export function Toolbar(): JSX.Element {
  const { t } = useI18n();
  const diagrams = useDiagramStore((state) => state.diagrams);
  const clearAll = useDiagramStore((state) => state.clearAll);
  const setAll = useDiagramStore((state) => state.setAll);
  const openDiagramModal = useUIStore((state) => state.openDiagramModal);

  const handleExportJSON = () => {
    try {
      exportToJSON(diagrams);
      toast.success('Diagrams exported successfully!');
    } catch (error) {
      toast.error('Failed to export diagrams');
      console.error(error);
    }
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const imported = await importFromJSON(file);
        setAll(imported);
        toast.success(`Imported ${imported.length} diagram(s)`);
      } catch (error) {
        toast.error('Failed to import diagrams');
        console.error(error);
      }
    };
    input.click();
  };

  const handleClearAll = () => {
    if (diagrams.length === 0) {
      toast.error('No diagrams to clear');
      return;
    }

    if (confirm(`Are you sure you want to delete all ${diagrams.length} diagram(s)? This cannot be undone.`)) {
      clearAll();
      toast.success('All diagrams cleared');
    }
  };

  const handleDownloadAll = async () => {
    if (diagrams.length === 0) {
      toast.error('No diagrams to download');
      return;
    }

    try {
      const { exportAllToZip } = await import('@/services/export.service');
      await exportAllToZip(diagrams);
      toast.success('All diagrams downloaded as ZIP');
    } catch (error) {
      toast.error('Failed to download diagrams');
      console.error(error);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white/90 p-4 shadow-lg backdrop-blur dark:bg-gray-800/90">
      <div className="flex items-center gap-3">
        <button
          onClick={() => openDiagramModal()}
          className="group relative flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-primary-600 to-purple-600 px-5 py-3 font-bold text-white shadow-lg transition-all hover:from-primary-700 hover:to-purple-700 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
          <Plus size={20} className="relative z-10 transition-transform group-hover:rotate-90" />
          <span className="relative z-10">{t('button.addDiagram')}</span>
        </button>
        <div className="rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-700">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {t('total')}: <strong className="text-gray-900 dark:text-white">{diagrams.length}</strong>
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleExportJSON}
          className="flex items-center gap-2 rounded-lg border border-emerald-600 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-100 active:scale-95 dark:border-emerald-500 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
        >
          <FileJson size={16} />
          {t('button.exportJSON')}
        </button>
        <button
          onClick={handleImportJSON}
          className="flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-100 active:scale-95 dark:border-blue-500 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950/50"
        >
          <Upload size={16} />
          {t('button.importJSON')}
        </button>
        <button
          onClick={handleDownloadAll}
          className="flex items-center gap-2 rounded-lg border border-emerald-600 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-100 active:scale-95 dark:border-emerald-500 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
        >
          <Download size={16} />
          {t('button.downloadAll')}
        </button>
        <button
          onClick={handleClearAll}
          className="flex items-center gap-2 rounded-lg border border-red-600 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition-all hover:bg-red-100 active:scale-95 dark:border-red-500 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
        >
          <Trash2 size={16} />
          {t('button.clearAll')}
        </button>
      </div>
    </div>
  );
}
