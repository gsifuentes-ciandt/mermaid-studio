import { create, type StateCreator } from 'zustand';

interface DiagramModalState {
  isOpen: boolean;
  editingDiagramId: string | null;
}

interface InfoModalState {
  isOpen: boolean;
  diagramId: string | null;
}

interface ZoomModalState {
  isOpen: boolean;
  diagramId: string | null;
}

export interface UIStoreState {
  diagramModal: DiagramModalState;
  infoModal: InfoModalState;
  zoomModal: ZoomModalState;
  importDialogOpen: boolean;
  setDiagramModal: (isOpen: boolean, editingDiagramId?: string | null) => void;
  setInfoModal: (isOpen: boolean, diagramId?: string | null) => void;
  setZoomModal: (isOpen: boolean, diagramId?: string | null) => void;
  setImportDialogOpen: (isOpen: boolean) => void;
  openDiagramModal: (editingDiagramId?: string | null) => void;
  closeDiagramModal: () => void;
  openInfoModal: (diagramId: string) => void;
  closeInfoModal: () => void;
  openZoomModal: (diagramId: string) => void;
  closeZoomModal: () => void;
}

const creator: StateCreator<UIStoreState> = (set) => ({
  diagramModal: { isOpen: false, editingDiagramId: null },
  infoModal: { isOpen: false, diagramId: null },
  zoomModal: { isOpen: false, diagramId: null },
  importDialogOpen: false,
  setDiagramModal: (isOpen, editingDiagramId = null) =>
    set({ diagramModal: { isOpen, editingDiagramId } }),
  setInfoModal: (isOpen, diagramId = null) =>
    set({ infoModal: { isOpen, diagramId } }),
  setZoomModal: (isOpen, diagramId = null) =>
    set({ zoomModal: { isOpen, diagramId } }),
  setImportDialogOpen: (isOpen) => set({ importDialogOpen: isOpen }),
  openDiagramModal: (editingDiagramId = null) =>
    set({ diagramModal: { isOpen: true, editingDiagramId } }),
  closeDiagramModal: () =>
    set({ diagramModal: { isOpen: false, editingDiagramId: null } }),
  openInfoModal: (diagramId) =>
    set({ infoModal: { isOpen: true, diagramId } }),
  closeInfoModal: () =>
    set({ infoModal: { isOpen: false, diagramId: null } }),
  openZoomModal: (diagramId) =>
    set({ zoomModal: { isOpen: true, diagramId } }),
  closeZoomModal: () =>
    set({ zoomModal: { isOpen: false, diagramId: null } })
});

export const useUIStore = create<UIStoreState>(creator);
