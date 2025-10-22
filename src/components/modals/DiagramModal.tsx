import { useEffect } from 'react';
import { FileText, Workflow, Wrench, Building2, GitBranch, FileCode } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { DiagramForm } from './DiagramForm';
import { useUIStore } from '@/store/uiStore';
import { useDiagramStore } from '@/store/diagramStore';
import { useI18n } from '@/contexts/I18nContext';
import type { DiagramType } from '@/types/diagram.types';

const typeConfig: Record<DiagramType, { icon: any; label: string; color: string; bgColor: string }> = {
  workflow: { icon: Workflow, label: 'Workflow', color: 'text-blue-100', bgColor: 'bg-blue-500/30 border-blue-400' },
  endpoint: { icon: Wrench, label: 'Endpoint/API', color: 'text-purple-100', bgColor: 'bg-purple-500/30 border-purple-400' },
  architecture: { icon: Building2, label: 'Architecture', color: 'text-emerald-100', bgColor: 'bg-emerald-500/30 border-emerald-400' },
  sequence: { icon: GitBranch, label: 'Sequence', color: 'text-amber-100', bgColor: 'bg-amber-500/30 border-amber-400' },
  state: { icon: FileCode, label: 'State Machine', color: 'text-pink-100', bgColor: 'bg-pink-500/30 border-pink-400' },
  other: { icon: FileText, label: 'Other', color: 'text-gray-100', bgColor: 'bg-gray-500/30 border-gray-400' },
};

export function DiagramModal(): JSX.Element {
  const { t } = useI18n();
  const { isOpen, editingDiagramId } = useUIStore((state) => state.diagramModal);
  const closeDiagramModal = useUIStore((state) => state.closeDiagramModal);
  const diagrams = useDiagramStore((state) => state.diagrams);

  const editingDiagram = editingDiagramId
    ? diagrams.find((d) => d.name === editingDiagramId)
    : undefined;

  const baseTitle = editingDiagram ? t('form.title.edit') : t('form.title.add');
  
  // Create title with badge if editing
  const title = editingDiagram ? (
    <>
      <h2 className="text-2xl font-bold text-white">{baseTitle}</h2>
      {editingDiagram.type && (
        <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 ${typeConfig[editingDiagram.type].bgColor}`}>
          {(() => {
            const TypeIcon = typeConfig[editingDiagram.type].icon;
            return <TypeIcon className={`h-4 w-4 ${typeConfig[editingDiagram.type].color}`} />;
          })()}
          <span className={`text-xs font-semibold ${typeConfig[editingDiagram.type].color}`}>
            {typeConfig[editingDiagram.type].label}
          </span>
        </div>
      )}
    </>
  ) : baseTitle;

  return (
    <Modal isOpen={isOpen} onClose={closeDiagramModal} title={title} size="xl">
      <DiagramForm diagram={editingDiagram} onClose={closeDiagramModal} />
    </Modal>
  );
}
