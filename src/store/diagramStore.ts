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

const filterDiagrams = (diagrams: Diagram[], filters: DiagramFilters): Diagram[] => {
  const filtered = diagrams.filter((diagram) => {
    const search = filters.searchTerm.trim().toLowerCase();
    const matchesSearch =
      search.length === 0 ||
      diagram.title.toLowerCase().includes(search) ||
      (diagram.description ?? '').toLowerCase().includes(search) ||
      (diagram.tags ?? '').toLowerCase().includes(search);
    const matchesType = filters.typeFilter === 'all' || diagram.type === filters.typeFilter;
    return matchesSearch && matchesType;
  });
  
  // Sort by updatedAt descending (most recent first)
  return filtered.sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt).getTime();
    const dateB = new Date(b.updatedAt || b.createdAt).getTime();
    return dateB - dateA; // Descending order
  });
};

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
  addDiagramToStore: (diagram: Diagram) => void; // Add to store only (no Supabase)
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
  addDiagram: async (diagram: Diagram) => {
    // Check if in collaboration mode
    const { isSupabaseConfigured } = await import('../services/supabase');
    
    if (isSupabaseConfigured()) {
      // Collaboration mode: Add to Supabase
      const { createDiagram } = await import('../services/diagram.service');
      const { useProjectStore } = await import('./projectStore');
      const { useAuthStore } = await import('./authStore');
      
      const { currentFolder } = useProjectStore.getState();
      const { user } = useAuthStore.getState();
      
      if (!currentFolder || !user) {
        console.error('Cannot add diagram: missing folder or user');
        return;
      }
      
      const result = await createDiagram({
        folder_id: currentFolder.id,
        created_by: user.id,
        name: diagram.name,
        title: diagram.title,
        description: diagram.description || '',
        code: diagram.code,
        type: diagram.type,
        tags: diagram.tags,
        httpMethod: diagram.httpMethod,
        endpointPath: diagram.endpointPath,
        requestPayloads: diagram.requestPayloads,
        responsePayloads: diagram.responsePayloads,
        workflowActors: diagram.workflowActors,
        workflowTrigger: diagram.workflowTrigger,
      });
      
      if (!result.success) {
        console.error('Failed to add diagram to Supabase:', result.error);
        return;
      }
      
      // Add to store state directly (no folder refresh needed)
      if (result.data) {
        const { cloudDiagramToLocal } = await import('../services/diagram.service');
        const localDiagram = cloudDiagramToLocal(result.data);
        set((state) => {
          const diagrams = [...state.diagrams, localDiagram];
          return {
            diagrams,
            metadata: computeMetadata(diagrams, state.filters)
          };
        });
      }
    } else {
      // Demo mode: Add to localStorage
      set((state) => {
        const diagrams = [...state.diagrams, diagram];
        return {
          diagrams,
          metadata: computeMetadata(diagrams, state.filters)
        };
      });
    }
  },
  addDiagramToStore: (diagram: Diagram) => {
    // Add to store only (used when diagram is already saved to Supabase)
    set((state) => {
      const diagrams = [...state.diagrams, diagram];
      return {
        diagrams,
        metadata: computeMetadata(diagrams, state.filters)
      };
    });
  },
  updateDiagram: async (diagram: Diagram) => {
    // Check if in collaboration mode
    const { isSupabaseConfigured } = await import('../services/supabase');
    
    if (isSupabaseConfigured()) {
      // Collaboration mode: Update in Supabase
      const { updateDiagram: updateDiagramService } = await import('../services/diagram.service');
      const result = await updateDiagramService(diagram.name, diagram);
      
      if (!result.success) {
        console.error('Failed to update diagram in Supabase:', result.error);
        return;
      }
      
      // Update store state (no reload needed!)
      set((state) => {
        const diagrams = state.diagrams.map((item) =>
          item.name === diagram.name ? { ...item, ...diagram } : item
        );
        return {
          diagrams,
          metadata: computeMetadata(diagrams, state.filters)
        };
      });
    } else {
      // Demo mode: Update in localStorage
      set((state) => {
        const diagrams = state.diagrams.map((item) =>
          item.name === diagram.name ? { ...item, ...diagram } : item
        );
        return {
          diagrams,
          metadata: computeMetadata(diagrams, state.filters)
        };
      });
    }
  },
  deleteDiagram: async (id: string) => {
    // Check if in collaboration mode
    const { isSupabaseConfigured } = await import('../services/supabase');
    
    if (isSupabaseConfigured()) {
      // Collaboration mode: Delete from Supabase
      const { deleteDiagram: deleteDiagramService } = await import('../services/diagram.service');
      const result = await deleteDiagramService(id);
      
      if (!result.success) {
        console.error('Failed to delete diagram from Supabase:', result.error);
        return;
      }
      
      // Update store state (no reload needed!)
      set((state) => {
        const diagrams = state.diagrams.filter((diagramItem) => diagramItem.name !== id);
        return {
          diagrams,
          selectedDiagramId: state.selectedDiagramId === id ? null : state.selectedDiagramId,
          metadata: computeMetadata(diagrams, state.filters)
        };
      });
    } else {
      // Demo mode: Delete from localStorage
      set((state) => {
        const diagrams = state.diagrams.filter((diagramItem) => diagramItem.name !== id);
        return {
          diagrams,
          selectedDiagramId: state.selectedDiagramId === id ? null : state.selectedDiagramId,
          metadata: computeMetadata(diagrams, state.filters)
        };
      });
    }
  },
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
