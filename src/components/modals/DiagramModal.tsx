import { useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { DiagramForm } from './DiagramForm';
import { useUIStore } from '@/store/uiStore';
import { useDiagramStore } from '@/store/diagramStore';

export function DiagramModal(): JSX.Element {
  const { isOpen, editingDiagramId } = useUIStore((state) => state.diagramModal);
  const closeDiagramModal = useUIStore((state) => state.closeDiagramModal);
  const diagrams = useDiagramStore((state) => state.diagrams);

  const editingDiagram = editingDiagramId
    ? diagrams.find((d) => d.name === editingDiagramId)
    : undefined;

  const title = editingDiagram ? 'Edit Diagram' : 'Add New Diagram';

  return (
    <Modal isOpen={isOpen} onClose={closeDiagramModal} title={title} size="xl">
      <DiagramForm diagram={editingDiagram} onClose={closeDiagramModal} />
    </Modal>
  );
}
