export type ExportFormat = 'svg' | 'png' | 'json' | 'zip';

export interface ExportRequest {
  diagramId: string;
  format: ExportFormat;
}

export interface ExportAllRequest {
  format: Exclude<ExportFormat, 'svg' | 'png'>;
}
