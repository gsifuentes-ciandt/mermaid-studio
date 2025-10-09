import { useState, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { EndpointFields } from './EndpointFields';
import { WorkflowFields } from './WorkflowFields';
import { useDiagramStore } from '@/store/diagramStore';
import type { Diagram, DiagramType, Payload } from '@/types/diagram.types';
import toast from 'react-hot-toast';

interface DiagramFormProps {
  diagram?: Diagram;
  onClose: () => void;
}

const diagramTypeOptions = [
  { value: '', label: 'Select a type...' },
  { value: 'workflow', label: '📄 Workflow - Business process flows' },
  { value: 'endpoint', label: '🔌 Endpoint/API - API documentation with payloads' },
  { value: 'architecture', label: '🏗️ Architecture - System design diagrams' },
  { value: 'sequence', label: '📝 Sequence - Interaction diagrams' },
  { value: 'state', label: '🔀 State Machine - State transitions' },
  { value: 'other', label: '📄 Other - General purpose' }
];

function generateFilename(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function DiagramForm({ diagram, onClose }: DiagramFormProps): JSX.Element {
  const addDiagram = useDiagramStore((state) => state.addDiagram);
  const updateDiagram = useDiagramStore((state) => state.updateDiagram);

  const [type, setType] = useState<DiagramType | ''>(diagram?.type || '');
  const [title, setTitle] = useState(diagram?.title || '');
  const [description, setDescription] = useState(diagram?.description || '');
  const [code, setCode] = useState(diagram?.code || '');
  const [tags, setTags] = useState(diagram?.tags || '');

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!type || !title || !code) {
      toast.error('Please fill in all required fields');
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
      toast.success('Diagram updated successfully!');
    } else {
      addDiagram(newDiagram);
      toast.success('Diagram created successfully!');
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Info Card */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
        <div className="mb-2 font-semibold text-blue-900 dark:text-blue-300">💡 Pro Tip</div>
        <div className="text-sm text-blue-800 dark:text-blue-200">
          Use diagram types to organize your documentation. Endpoint/API diagrams include special
          fields for request/response payloads, while Workflow diagrams help document business
          processes.
        </div>
      </div>

      {/* Diagram Type */}
      <div>
        <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">
          Diagram Type <span className="text-red-500">*</span>
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
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., User Authentication Flow"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the purpose of this diagram..."
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
        <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">
          Mermaid Code <span className="text-red-500">*</span>
        </label>
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
        <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">Tags</label>
        <Input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., authentication, security, api (comma-separated)"
        />
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {diagram ? 'Update Diagram' : 'Create Diagram'}
        </Button>
      </div>
    </form>
  );
}
