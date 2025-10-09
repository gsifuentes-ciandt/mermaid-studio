export type DiagramType =
  | 'workflow'
  | 'endpoint'
  | 'architecture'
  | 'sequence'
  | 'state'
  | 'other';

export interface Payload {
  status: string;
  contentType: string;
  json: string;
}

export interface DiagramBase {
  name: string;
  title: string;
  description?: string;
  code: string;
  type: DiagramType;
  tags?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EndpointDiagramFields {
  httpMethod?: string;
  endpointPath?: string;
  requestPayloads?: Payload[];
  responsePayloads?: Payload[];
}

export interface WorkflowDiagramFields {
  workflowActors?: string;
  workflowTrigger?: string;
}

export type Diagram = DiagramBase &
  Partial<EndpointDiagramFields & WorkflowDiagramFields>;

export interface DiagramFilters {
  searchTerm: string;
  typeFilter: DiagramType | 'all';
}

export interface DiagramMetadata {
  total: number;
  filtered: number;
}

export interface DiagramFormValues extends Omit<Diagram, 'createdAt' | 'updatedAt'> {
  createdAt?: string;
  updatedAt?: string;
}

export interface DiagramRenderContext {
  id: string;
  svg?: string;
  error?: string;
}
