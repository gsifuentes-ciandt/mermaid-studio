import { useState, useEffect, type FormEvent } from 'react';
import { Copy, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { EndpointFields } from './EndpointFields';
import { WorkflowFields } from './WorkflowFields';
import { useDiagramStore } from '@/store/diagramStore';
import { useI18n } from '@/contexts/I18nContext';
import type { Diagram, DiagramType, Payload } from '@/types/diagram.types';
import toast from 'react-hot-toast';

interface DiagramFormProps {
  diagram?: Diagram;
  onClose: () => void;
}


function generateFilename(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function DiagramForm({ diagram, onClose }: DiagramFormProps): JSX.Element {
  const { t } = useI18n();
  const addDiagram = useDiagramStore((state) => state.addDiagram);
  const updateDiagram = useDiagramStore((state) => state.updateDiagram);

  const diagramTypeOptions = [
    { value: '', label: t('form.field.typePlaceholder') },
    { value: 'workflow', label: '📄 ' + t('form.field.typeOptions.workflow') },
    { value: 'endpoint', label: '🔌 ' + t('form.field.typeOptions.endpoint') },
    { value: 'architecture', label: '🏗️ ' + t('form.field.typeOptions.architecture') },
    { value: 'sequence', label: '📝 ' + t('form.field.typeOptions.sequence') },
    { value: 'state', label: '🔀 ' + t('form.field.typeOptions.state') },
    { value: 'other', label: '📄 ' + t('form.field.typeOptions.other') }
  ];

  const [type, setType] = useState<DiagramType | ''>(diagram?.type || '');
  const [title, setTitle] = useState(diagram?.title || '');
  const [description, setDescription] = useState(diagram?.description || '');
  const [code, setCode] = useState(diagram?.code || '');
  const [tags, setTags] = useState(diagram?.tags || '');
  const [copied, setCopied] = useState(false);

  // Endpoint fields
  const [httpMethod, setHttpMethod] = useState(diagram?.httpMethod || '');
  const [endpointPath, setEndpointPath] = useState(diagram?.endpointPath || '');
  const [requestPayloads, setRequestPayloads] = useState<Payload[]>(
    diagram?.requestPayloads || []
  );
  const [responsePayloads, setResponsePayloads] = useState<Payload[]>(
    diagram?.responsePayloads || []
  );

  // Workflow fields
  const [workflowActors, setWorkflowActors] = useState(diagram?.workflowActors || '');
  const [workflowTrigger, setWorkflowTrigger] = useState(diagram?.workflowTrigger || '');

  const handleCopyCode = async () => {
    if (!code) return;
    
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success(t('ai.toast.codeCopied'));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(t('ai.toast.copyFailed'));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!type || !title || !code) {
      toast.error(t('form.error.required'));
      return;
    }

    const name = diagram?.name || generateFilename(title);
    const now = new Date().toISOString();

    const newDiagram: Diagram = {
      name,
      title,
      description,
      code,
      type: type as DiagramType,
      tags,
      createdAt: diagram?.createdAt || now,
      updatedAt: now,
      ...(type === 'endpoint' && {
        httpMethod,
        endpointPath,
        requestPayloads,
        responsePayloads
      }),
      ...(type === 'workflow' && {
        workflowActors,
        workflowTrigger
      })
    };

    if (diagram) {
      updateDiagram(newDiagram);
      toast.success(t('form.success.updated'));
    } else {
      addDiagram(newDiagram);
      toast.success(t('form.success.created'));
    }

    onClose();
  };

  return (
    <form id="diagram-form" onSubmit={handleSubmit} className="space-y-6">
      {/* Info Card */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
        <div className="mb-2 font-semibold text-blue-900 dark:text-blue-300">💡 {t('form.proTip.title')}</div>
        <div className="text-sm text-blue-800 dark:text-blue-200">
          {t('form.proTip.message')}
        </div>
      </div>

      {/* Diagram Type */}
      <div>
        <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">
          {t('form.field.type')} <span className="text-red-500">*</span>
        </label>
        <Select
          value={type}
          onChange={(e) => setType(e.target.value as DiagramType | '')}
          options={diagramTypeOptions}
          required
        />
      </div>

      {/* Title */}
      <div>
        <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">
          {t('form.field.title')} <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('form.field.titlePlaceholder')}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">{t('form.field.description')}</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('form.field.descriptionPlaceholder')}
          rows={3}
        />
      </div>

      {/* Type-specific fields */}
      {type === 'endpoint' && (
        <EndpointFields
          httpMethod={httpMethod}
          setHttpMethod={setHttpMethod}
          endpointPath={endpointPath}
          setEndpointPath={setEndpointPath}
          requestPayloads={requestPayloads}
          setRequestPayloads={setRequestPayloads}
          responsePayloads={responsePayloads}
          setResponsePayloads={setResponsePayloads}
        />
      )}

      {type === 'workflow' && (
        <WorkflowFields
          workflowActors={workflowActors}
          setWorkflowActors={setWorkflowActors}
          workflowTrigger={workflowTrigger}
          setWorkflowTrigger={setWorkflowTrigger}
        />
      )}

      {/* Mermaid Code */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="font-semibold text-gray-700 dark:text-gray-300">
            {t('form.field.code')} <span className="text-red-500">*</span>
          </label>
          {code && (
            <button
              type="button"
              onClick={handleCopyCode}
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
                  <span>{t('form.button.copy')}</span>
                </>
              )}
            </button>
          )}
        </div>
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="graph TD&#10;    A[Start] --> B[End]"
          rows={12}
          required
          className="font-mono text-sm"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">{t('form.field.tags')}</label>
        <Input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder={t('form.field.tagsPlaceholder')}
        />
      </div>

    </form>
  );
}
