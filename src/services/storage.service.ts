import type { Diagram } from '@/types/diagram.types';

const LEGACY_STORAGE_KEY = 'mermaid-diagrams-pro';
const CURRENT_STORAGE_KEY = 'mermaidDiagrams';

interface StoredState {
  state?: {
    diagrams?: Diagram[];
  };
}

function parseJSON<T>(value: string | null): T | undefined {
  if (!value) return undefined;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn('Failed to parse storage payload', error);
    return undefined;
  }
}

export function migrateLegacyStorage(): void {
  if (typeof window === 'undefined') return;

  const storage = window.localStorage;
  const currentRaw = storage.getItem(CURRENT_STORAGE_KEY);
  if (currentRaw) return; // already migrated

  const legacyRaw = storage.getItem(LEGACY_STORAGE_KEY);
  const legacyDiagrams = parseJSON<Diagram[]>(legacyRaw);
  if (!legacyDiagrams || legacyDiagrams.length === 0) return;

  const payload: StoredState = {
    state: {
      diagrams: legacyDiagrams
    }
  };

  storage.setItem(CURRENT_STORAGE_KEY, JSON.stringify(payload));
}

export function loadInitialDiagrams(): Diagram[] {
  if (typeof window === 'undefined') return [];

  try {
    migrateLegacyStorage();
    const storage = window.localStorage;
    const persisted = parseJSON<StoredState>(storage.getItem(CURRENT_STORAGE_KEY));
    return persisted?.state?.diagrams ?? [];
  } catch (error) {
    console.warn('Failed to load persisted diagrams', error);
    return [];
  }
}
