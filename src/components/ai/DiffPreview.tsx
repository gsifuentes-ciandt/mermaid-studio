import { X, Check, Copy, CheckCheck, Workflow, Wrench, Box, GitBranch, Activity, FileText, FilePlus } from 'lucide-react';
import { useState } from 'react';
import { useAIStore } from '../../store/aiStore';
import { useMermaidRenderer } from '../../hooks/useMermaidRenderer';
import { useI18n } from '../../contexts/I18nContext';
import { DiagramType } from '../../types/diagram.types';
import toast from 'react-hot-toast';

// Type badge configuration
const typeConfig: Record<DiagramType, { icon: typeof Workflow; label: string; color: string; bgColor: string }> = {
  workflow: { icon: Workflow, label: 'Workflow', color: 'text-blue-700 dark:text-blue-300', bgColor: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700' },
  endpoint: { icon: Wrench, label: 'Endpoint/API', color: 'text-purple-700 dark:text-purple-300', bgColor: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700' },
  architecture: { icon: Box, label: 'Architecture', color: 'text-emerald-700 dark:text-emerald-300', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700' },
  sequence: { icon: GitBranch, label: 'Sequence', color: 'text-amber-700 dark:text-amber-300', bgColor: 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700' },
  state: { icon: Activity, label: 'State Machine', color: 'text-rose-700 dark:text-rose-300', bgColor: 'bg-rose-100 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700' },
  other: { icon: FileText, label: 'Other', color: 'text-gray-700 dark:text-gray-300', bgColor: 'bg-gray-100 dark:bg-gray-900/30 border-gray-300 dark:border-gray-700' },
};

export const DiffPreview = () => {
  const { t } = useI18n();
  const { diffPreview, acceptSuggestion, acceptSuggestionAsNew, rejectSuggestion, contextDiagram } = useAIStore();
  const { svg, error } = useMermaidRenderer(diffPreview?.suggestedCode || '');
  const [copied, setCopied] = useState(false);

  if (!diffPreview) return null;

  const isEditing = !!contextDiagram;
  const diagramType = (diffPreview.metadata?.type || 'other') as DiagramType;
  const typeInfo = typeConfig[diagramType];
  const TypeIcon = typeInfo.icon;

  const handleCopy = async () => {
    if (!diffPreview.suggestedCode) return;
    
    try {
      await navigator.clipboard.writeText(diffPreview.suggestedCode);
      setCopied(true);
      toast.success(t('ai.toast.codeCopied'));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(t('ai.toast.copyFailed'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 max-md:p-0">
      <div className="flex h-full w-full max-w-6xl flex-col rounded-lg bg-white shadow-2xl dark:bg-gray-900 max-md:rounded-none max-md:max-w-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 max-md:p-3 dark:border-gray-700">
          <div className="flex items-center gap-3 max-md:gap-2">
            <h3 className="text-lg max-md:text-base font-semibold text-gray-900 dark:text-white">
              {isEditing ? t('diff.title.changes') : t('diff.title.review')}
            </h3>
            {/* Type Badge */}
            <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 max-md:px-2 max-md:py-0.5 ${typeInfo.bgColor}`}>
              <TypeIcon className={`h-4 w-4 max-md:h-3 max-md:w-3 ${typeInfo.color}`} />
              <span className={`text-xs max-md:text-[10px] font-semibold ${typeInfo.color}`}>
                {typeInfo.label}
              </span>
            </div>
          </div>
          <button
            onClick={rejectSuggestion}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 max-md:p-4">
          {/* Title & Description */}
          {(diffPreview.metadata?.title || diffPreview.metadata?.description) && (
            <div className="mb-4 rounded-lg border border-primary-200 bg-primary-50 p-4 dark:border-primary-700 dark:bg-primary-900/30">
              {diffPreview.metadata?.title && (
                <h4 className="mb-1 text-base font-semibold text-primary-900 dark:text-primary-100">
                  {diffPreview.metadata.title}
                </h4>
              )}
              {diffPreview.metadata?.description && (
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  {diffPreview.metadata.description}
                </p>
              )}
            </div>
          )}

          {/* Explanation - only show if no metadata description */}
          {!diffPreview.metadata?.description && diffPreview.explanation && (
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('diff.explanation')}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {diffPreview.explanation}
              </p>
            </div>
          )}

          {/* Preview */}
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('diff.preview')}
            </h4>
            <div className="overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-6 max-md:p-3 dark:border-gray-700 dark:bg-gray-800" style={{ maxHeight: 'calc(100vh - 300px)', minHeight: '400px' }}>
              <div className="flex min-h-full items-center justify-center">
                {error ? (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                ) : svg ? (
                  <div 
                    className="mermaid-preview max-w-full rounded-lg bg-white p-8 max-md:p-4 shadow-sm" 
                    dangerouslySetInnerHTML={{ __html: svg }} 
                  />
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Loading preview...</p>
                )}
              </div>
            </div>
          </div>

          {/* Type-Specific Fields */}
          {diagramType === 'endpoint' && (diffPreview.metadata?.httpMethod || diffPreview.metadata?.endpointPath) && (
            <div className="mb-4 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-700 dark:bg-purple-900/20">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-purple-900 dark:text-purple-100">
                <Wrench className="h-4 w-4" />
                {t('endpoint.title')}
              </h4>
              <div className="space-y-3">
                {diffPreview.metadata.httpMethod && (
                  <div>
                    <span className="text-xs font-medium text-purple-700 dark:text-purple-300">{t('endpoint.method')}:</span>
                    <div className="mt-1 inline-block rounded bg-purple-100 px-2 py-1 text-xs font-bold text-purple-900 dark:bg-purple-800 dark:text-purple-100">
                      {diffPreview.metadata.httpMethod}
                    </div>
                  </div>
                )}
                {diffPreview.metadata.endpointPath && (
                  <div>
                    <span className="text-xs font-medium text-purple-700 dark:text-purple-300">{t('endpoint.path')}:</span>
                    <code className="mt-1 block rounded bg-purple-100 px-3 py-1.5 text-xs text-purple-900 dark:bg-purple-800 dark:text-purple-100">
                      {diffPreview.metadata.endpointPath}
                    </code>
                  </div>
                )}
                {diffPreview.metadata.requestPayloads && diffPreview.metadata.requestPayloads.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-purple-700 dark:text-purple-300">{t('endpoint.request.title')}:</span>
                    {diffPreview.metadata.requestPayloads.map((payload: { status: string; contentType: string; json: string }, idx: number) => (
                      <div key={idx} className="mt-2 rounded bg-purple-100 p-3 dark:bg-purple-800">
                        <div className="mb-1 flex items-center gap-2 text-xs">
                          <span className="font-semibold text-purple-900 dark:text-purple-100">{payload.status}</span>
                          <span className="text-purple-700 dark:text-purple-300">•</span>
                          <span className="text-purple-700 dark:text-purple-300">{payload.contentType}</span>
                        </div>
                        <pre className="overflow-x-auto text-xs text-purple-900 dark:text-purple-100">
                          <code>{payload.json}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
                {diffPreview.metadata.responsePayloads && diffPreview.metadata.responsePayloads.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-purple-700 dark:text-purple-300">{t('endpoint.response.title')}:</span>
                    {diffPreview.metadata.responsePayloads.map((payload: { status: string; contentType: string; json: string }, idx: number) => (
                      <div key={idx} className="mt-2 rounded bg-purple-100 p-3 dark:bg-purple-800">
                        <div className="mb-1 flex items-center gap-2 text-xs">
                          <span className="font-semibold text-purple-900 dark:text-purple-100">Status {payload.status}</span>
                          <span className="text-purple-700 dark:text-purple-300">•</span>
                          <span className="text-purple-700 dark:text-purple-300">{payload.contentType}</span>
                        </div>
                        <pre className="overflow-x-auto text-xs text-purple-900 dark:text-purple-100">
                          <code>{payload.json}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {diagramType === 'workflow' && (diffPreview.metadata?.workflowActors || diffPreview.metadata?.workflowTrigger) && (
            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/20">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-900 dark:text-blue-100">
                <Workflow className="h-4 w-4" />
                {t('workflow.title')}
              </h4>
              <div className="space-y-3">
                {diffPreview.metadata.workflowActors && (
                  <div>
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">{t('workflow.actors')}:</span>
                    <p className="mt-1 text-sm text-blue-900 dark:text-blue-100">
                      {diffPreview.metadata.workflowActors}
                    </p>
                  </div>
                )}
                {diffPreview.metadata.workflowTrigger && (
                  <div>
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">{t('workflow.trigger')}:</span>
                    <p className="mt-1 text-sm text-blue-900 dark:text-blue-100">
                      {diffPreview.metadata.workflowTrigger}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Code */}
          {diffPreview.suggestedCode && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('diff.code')}
                </h4>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-primary-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:border-primary-500"
                  title="Copy code"
                >
                  {copied ? (
                    <>
                      <CheckCheck className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                      <span className="text-green-600 dark:text-green-400">{t('button.copied')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>{t('diff.button.copy')}</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-lg bg-gray-100 p-4 text-xs dark:bg-gray-800">
                <code className="text-gray-800 dark:text-gray-200">
                  {diffPreview.suggestedCode}
                </code>
              </pre>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-between gap-3 border-t border-gray-200 p-4 max-md:p-3 dark:border-gray-700">
          <button
            onClick={rejectSuggestion}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 max-md:px-3 max-md:py-1.5"
          >
            {t('diff.button.reject')}
          </button>
          
          <div className="flex flex-wrap gap-3 max-md:gap-2">
            {isEditing && (
              <button
                onClick={acceptSuggestionAsNew}
                className="flex items-center gap-2 rounded-lg border border-primary-500 bg-white px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 dark:border-primary-600 dark:bg-gray-800 dark:text-primary-400 dark:hover:bg-gray-700 max-md:px-3 max-md:py-1.5"
                title={t('diff.button.saveAsNewTooltip')}
              >
                <FilePlus className="h-4 w-4" />
                <span className="max-md:hidden">{t('diff.button.saveAsNew')}</span>
                <span className="md:hidden">Save New</span>
              </button>
            )}
            <button
              onClick={acceptSuggestion}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary-500 to-purple-600 px-4 py-2 text-sm font-medium text-white hover:from-primary-600 hover:to-purple-700 max-md:px-3 max-md:py-1.5"
            >
              <Check className="h-4 w-4" />
              {isEditing ? t('diff.button.update') : t('diff.button.accept')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
