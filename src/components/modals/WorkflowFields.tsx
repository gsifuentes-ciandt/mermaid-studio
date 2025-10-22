import { Input } from '@/components/ui/Input';
import { useI18n } from '@/contexts/I18nContext';

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
  const { t } = useI18n();
  
  return (
    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
      <div className="mb-4 flex items-center gap-2 text-lg font-bold text-primary-600 dark:text-primary-400">
        📄 {t('workflow.title')}
      </div>

      {/* Actors/Participants */}
      <div className="mb-4">
        <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">{t('workflow.actors')}</label>
        <Input
          type="text"
          value={workflowActors}
          onChange={(e) => setWorkflowActors(e.target.value)}
          placeholder={t('workflow.actorsPlaceholder')}
        />
      </div>

      {/* Trigger Event */}
      <div>
        <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">{t('workflow.trigger')}</label>
        <Input
          type="text"
          value={workflowTrigger}
          onChange={(e) => setWorkflowTrigger(e.target.value)}
          placeholder={t('workflow.triggerPlaceholder')}
        />
      </div>
    </div>
  );
}
