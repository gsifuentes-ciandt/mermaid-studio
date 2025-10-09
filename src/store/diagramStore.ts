import { create, type StateCreator } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { Diagram, DiagramFilters, DiagramMetadata } from '@/types/diagram.types';
import { loadInitialDiagrams } from '@/services/storage.service';

const STORAGE_KEY = 'mermaidDiagrams';

const fallbackStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined
};

const storage = createJSONStorage<DiagramStore>(() =>
  typeof window === 'undefined' ? fallbackStorage : window.localStorage
);

const defaultFilters: DiagramFilters = {
  searchTerm: '',
  typeFilter: 'all'
};

const initialDiagrams = loadInitialDiagrams();

const filterDiagrams = (diagrams: Diagram[], filters: DiagramFilters): Diagram[] =>
  diagrams.filter((diagram) => {
    const search = filters.searchTerm.trim().toLowerCase();
    const matchesSearch =
      search.length === 0 ||
      diagram.title.toLowerCase().includes(search) ||
      (diagram.description ?? '').toLowerCase().includes(search) ||
      (diagram.tags ?? '').toLowerCase().includes(search);
    const matchesType = filters.typeFilter === 'all' || diagram.type === filters.typeFilter;
    return matchesSearch && matchesType;
  });

const computeMetadata = (diagrams: Diagram[], filters: DiagramFilters): DiagramMetadata => ({
  total: diagrams.length,
  filtered: filterDiagrams(diagrams, filters).length
});

export interface DiagramStore {
  diagrams: Diagram[];
  filters: DiagramFilters;
  selectedDiagramId: string | null;
  metadata: DiagramMetadata;
  addDiagram: (diagram: Diagram) => void;
  updateDiagram: (diagram: Diagram) => void;
  deleteDiagram: (id: string) => void;
  setFilters: (filters: Partial<DiagramFilters>) => void;
  setSelectedDiagram: (id: string | null) => void;
  clearAll: () => void;
  setAll: (diagrams: Diagram[]) => void;
  filteredDiagrams: () => Diagram[];
  refreshMetadata: () => void;
}

type DiagramStoreCreator = StateCreator<
  DiagramStore,
  [],
  [],
  DiagramStore
>;

const diagramStoreCreator: DiagramStoreCreator = (set, get) => ({
  diagrams: initialDiagrams,
  filters: defaultFilters,
  selectedDiagramId: null,
  metadata: computeMetadata(initialDiagrams, defaultFilters),
  addDiagram: (diagram: Diagram) =>
    set((state) => {
      const diagrams = [...state.diagrams, diagram];
      return {
        diagrams,
        metadata: computeMetadata(diagrams, state.filters)
      };
    }),
  updateDiagram: (diagram: Diagram) =>
    set((state) => {
      const diagrams = state.diagrams.map((item) =>
        item.name === diagram.name ? { ...item, ...diagram } : item
      );
      return {
        diagrams,
        metadata: computeMetadata(diagrams, state.filters)
      };
    }),
  deleteDiagram: (id: string) =>
    set((state) => {
      const diagrams = state.diagrams.filter((diagramItem) => diagramItem.name !== id);
      return {
        diagrams,
        selectedDiagramId: state.selectedDiagramId === id ? null : state.selectedDiagramId,
        metadata: computeMetadata(diagrams, state.filters)
      };
    }),
  setFilters: (filters: Partial<DiagramFilters>) =>
    set((state) => {
      const nextFilters = { ...state.filters, ...filters };
      return {
        filters: nextFilters,
        metadata: computeMetadata(state.diagrams, nextFilters)
      };
    }),
  setSelectedDiagram: (id: string | null) => set({ selectedDiagramId: id }),
  clearAll: () =>
    set((state) => ({
      diagrams: [],
      selectedDiagramId: null,
      metadata: computeMetadata([], state.filters)
    })),
  setAll: (diagrams: Diagram[]) =>
    set((state) => ({
      diagrams,
      metadata: computeMetadata(diagrams, state.filters)
    })),
  filteredDiagrams: () => filterDiagrams(get().diagrams, get().filters),
  refreshMetadata: () =>
    set((state) => ({ metadata: computeMetadata(state.diagrams, state.filters) }))
});

export const useDiagramStore = create<DiagramStore>()(
  persist(diagramStoreCreator, {
    name: STORAGE_KEY,
    storage
  })
);
