import type { Diagram, DiagramFormValues, DiagramType, Payload } from '@/types/diagram.types';

export const DIAGRAM_TYPES: ReadonlyArray<{ value: DiagramType; label: string }> = [
  { value: 'workflow', label: 'Workflow' },
  { value: 'endpoint', label: 'Endpoint / API' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'sequence', label: 'Sequence' },
  { value: 'state', label: 'State Machine' },
  { value: 'other', label: 'Other' }
];

export function getDiagramTypeLabel(type: DiagramType): string {
  return DIAGRAM_TYPES.find((item) => item.value === type)?.label ?? 'Other';
}

export function generateFilename(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 80);
}

export function normalizeTags(tags?: string): string[] {
  if (!tags) return [];
  return tags
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

export function createEmptyDiagram(type: DiagramType): DiagramFormValues {
  const timestamp = new Date().toISOString();
  return {
    name: '',
    title: '',
    description: '',
    code: 'graph TD\n    A[Start] --> B[Finish]',
    type,
    tags: '',
    createdAt: timestamp,
    updatedAt: timestamp,
    httpMethod: type === 'endpoint' ? 'GET' : undefined,
    endpointPath: type === 'endpoint' ? '' : undefined,
    requestPayloads: type === 'endpoint' ? [] : undefined,
    responsePayloads: type === 'endpoint' ? [] : undefined,
    workflowActors: type === 'workflow' ? '' : undefined,
    workflowTrigger: type === 'workflow' ? '' : undefined
  };
}

export function isEndpointDiagram(diagram: DiagramFormValues | Diagram): boolean {
  return diagram.type === 'endpoint';
}

export function isWorkflowDiagram(diagram: DiagramFormValues | Diagram): boolean {
  return diagram.type === 'workflow';
}

export function ensurePayload(payload?: Payload): Payload {
  return {
    status: payload?.status ?? '',
    contentType: payload?.contentType ?? 'application/json',
    json: payload?.json ?? '{\n  "key": "value"\n}'
  };
}

export function clonePayloads(payloads?: Payload[]): Payload[] | undefined {
  return payloads?.map((payload) => ({ ...payload }));
}

export function prepareDiagramForSave(values: DiagramFormValues): Diagram {
  const timestamp = new Date().toISOString();
  return {
    ...values,
    name: values.name || generateFilename(values.title),
    tags: values.tags,
    createdAt: values.createdAt ?? timestamp,
    updatedAt: timestamp
  };
}
