import type { Diagram } from '@/types/diagram.types';

interface ImportResult {
  imported: number;
  replaced: number;
  skipped: number;
  diagrams: Diagram[];
}

export async function readJsonFile(file: File): Promise<string> {
  const text = await file.text();
  return text;
}

export function parseImportedDiagrams(content: string): Diagram[] {
  const data = JSON.parse(content);
  if (!Array.isArray(data)) {
    throw new Error('Invalid JSON format. Expected an array of diagrams.');
  }
  return data as Diagram[];
}

export function mergeImportedDiagrams(
  existing: Diagram[],
  imported: Diagram[]
): ImportResult {
  const map = new Map(existing.map((diagram) => [diagram.name, diagram]));
  let replaced = 0;
  let skipped = 0;

  imported.forEach((diagram) => {
    if (!diagram?.name) {
      skipped += 1;
      return;
    }

    if (map.has(diagram.name)) {
      replaced += 1;
    }

    map.set(diagram.name, {
      ...diagram,
      createdAt: diagram.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  });

  return {
    imported: imported.length,
    replaced,
    skipped,
    diagrams: Array.from(map.values())
  };
}

// Simplified import function for compatibility
export async function importFromJSON(file: File): Promise<Diagram[]> {
  const content = await readJsonFile(file);
  return parseImportedDiagrams(content);
}
