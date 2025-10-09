import { Input } from '@/components/ui/Input';

interface WorkflowFieldsProps {
  workflowActors: string;
  setWorkflowActors: (value: string) => void;
  workflowTrigger: string;
  setWorkflowTrigger: (value: string) => void;
}

export function WorkflowFields({
  workflowActors,
  setWorkflowActors,
  workflowTrigger,
  setWorkflowTrigger
}: WorkflowFieldsProps): JSX.Element {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <div className="mb-4 flex items-center gap-2 text-lg font-bold text-primary-600">
        📄 Workflow Details
      </div>

      {/* Actors/Participants */}
      <div className="mb-4">
        <label className="mb-2 block font-semibold text-gray-700">Actors/Participants</label>
        <Input
          type="text"
          value={workflowActors}
          onChange={(e) => setWorkflowActors(e.target.value)}
          placeholder="e.g., User, System, Admin (comma-separated)"
        />
      </div>

      {/* Trigger Event */}
      <div>
        <label className="mb-2 block font-semibold text-gray-700">Trigger Event</label>
        <Input
          type="text"
          value={workflowTrigger}
          onChange={(e) => setWorkflowTrigger(e.target.value)}
          placeholder="e.g., User clicks login button"
        />
      </div>
    </div>
  );
}
