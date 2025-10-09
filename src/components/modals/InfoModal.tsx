import { Calendar, Tag, Code, Globe, Users, Zap } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useUIStore } from '@/store/uiStore';
import { useDiagramStore } from '@/store/diagramStore';
import type { Diagram } from '@/types/diagram.types';

const typeIcons: Record<string, JSX.Element> = {
  workflow: <Users className="h-6 w-6" />,
  endpoint: <Globe className="h-6 w-6" />,
  architecture: <Code className="h-6 w-6" />,
  sequence: <Zap className="h-6 w-6" />,
  state: <Code className="h-6 w-6" />,
  other: <Tag className="h-6 w-6" />
};

const typeColors: Record<string, string> = {
  workflow: 'from-blue-500 to-blue-600',
  endpoint: 'from-green-500 to-green-600',
  architecture: 'from-yellow-500 to-yellow-600',
  sequence: 'from-pink-500 to-pink-600',
  state: 'from-indigo-500 to-indigo-600',
  other: 'from-gray-500 to-gray-600'
};

function EndpointDetails({ diagram }: { diagram: Diagram }) {
  return (
    <div className="space-y-6">
      {/* HTTP Method & Path */}
      {(diagram.httpMethod || diagram.endpointPath) && (
        <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-green-900">
            <Globe className="h-5 w-5" />
            Endpoint Information
          </h3>
          <div className="space-y-2">
            {diagram.httpMethod && (
              <div className="flex items-center gap-3">
                <span className="font-semibold text-green-800">Method:</span>
                <span className="rounded-full bg-green-600 px-3 py-1 text-sm font-bold text-white">
                  {diagram.httpMethod}
                </span>
              </div>
            )}
            {diagram.endpointPath && (
              <div className="flex items-center gap-3">
                <span className="font-semibold text-green-800">Path:</span>
                <code className="rounded bg-green-100 px-3 py-1 font-mono text-sm text-green-900">
                  {diagram.endpointPath}
                </code>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Request Payloads */}
      {diagram.requestPayloads && diagram.requestPayloads.length > 0 && (
        <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-3 text-lg font-bold text-blue-900">📥 Request Payloads</h3>
          <div className="space-y-3">
            {diagram.requestPayloads.map((payload, index) => (
              <div key={index} className="rounded-lg bg-white p-3 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                    #{index + 1}
                  </span>
                  {payload.status && (
                    <span className="text-sm font-semibold text-blue-900">{payload.status}</span>
                  )}
                  <span className="ml-auto text-xs text-gray-600">{payload.contentType}</span>
                </div>
                {payload.json && (
                  <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-xs">
                    <code>{payload.json}</code>
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Response Payloads */}
      {diagram.responsePayloads && diagram.responsePayloads.length > 0 && (
        <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-4">
          <h3 className="mb-3 text-lg font-bold text-purple-900">📤 Response Payloads</h3>
          <div className="space-y-3">
            {diagram.responsePayloads.map((payload, index) => {
              const statusCode = parseInt(payload.status);
              const isSuccess = statusCode >= 200 && statusCode < 300;
              const isError = statusCode >= 400;
              const statusColor = isSuccess
                ? 'bg-green-600'
                : isError
                ? 'bg-red-600'
                : 'bg-yellow-600';

              return (
                <div key={index} className="rounded-lg bg-white p-3 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`rounded px-2 py-0.5 text-xs font-bold text-white ${statusColor}`}>
                      {payload.status}
                    </span>
                    <span className="ml-auto text-xs text-gray-600">{payload.contentType}</span>
                  </div>
                  {payload.json && (
                    <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-xs">
                      <code>{payload.json}</code>
                    </pre>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function WorkflowDetails({ diagram }: { diagram: Diagram }) {
  return (
    <div className="space-y-4">
      {diagram.workflowActors && (
        <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-blue-900">
            <Users className="h-5 w-5" />
            Actors/Participants
          </h3>
          <p className="text-blue-800">{diagram.workflowActors}</p>
        </div>
      )}

      {diagram.workflowTrigger && (
        <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-4">
          <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-purple-900">
            <Zap className="h-5 w-5" />
            Trigger Event
          </h3>
          <p className="text-purple-800">{diagram.workflowTrigger}</p>
        </div>
      )}
    </div>
  );
}

export function InfoModal(): JSX.Element | null {
  const { isOpen, diagramId } = useUIStore((state) => state.infoModal);
  const closeInfoModal = useUIStore((state) => state.closeInfoModal);
  const diagrams = useDiagramStore((state) => state.diagrams);

  const diagram = diagramId ? diagrams.find((d) => d.name === diagramId) : undefined;

  if (!isOpen || !diagram) return null;

  const typeColor = typeColors[diagram.type] || typeColors.other;
  const typeIcon = typeIcons[diagram.type] || typeIcons.other;

  return (
    <Modal isOpen={isOpen} onClose={closeInfoModal} title="Diagram Details" size="lg">
      <div className="space-y-6">
        {/* Header Card */}
        <div className={`rounded-xl bg-gradient-to-r ${typeColor} p-6 text-white shadow-lg`}>
          <div className="mb-3 flex items-center gap-3">
            {typeIcon}
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold uppercase">
              {diagram.type}
            </span>
          </div>
          <h2 className="mb-2 text-2xl font-bold">{diagram.title}</h2>
          {diagram.description && <p className="text-white/90">{diagram.description}</p>}
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <Calendar className="h-4 w-4" />
              Created
            </div>
            <div className="text-sm text-gray-900 dark:text-white">
              {new Date(diagram.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <Calendar className="h-4 w-4" />
              Updated
            </div>
            <div className="text-sm text-gray-900 dark:text-white">
              {new Date(diagram.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Tags */}
        {diagram.tags && (
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <div className="mb-2 flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
              <Tag className="h-4 w-4" />
              Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {diagram.tags.split(',').map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-700"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Type-specific details */}
        {diagram.type === 'endpoint' && <EndpointDetails diagram={diagram} />}
        {diagram.type === 'workflow' && <WorkflowDetails diagram={diagram} />}

        {/* Mermaid Code */}
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          <div className="mb-2 flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
            <Code className="h-4 w-4" />
            Mermaid Code
          </div>
          <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-green-400">
            <code>{diagram.code}</code>
          </pre>
        </div>
      </div>
    </Modal>
  );
}
