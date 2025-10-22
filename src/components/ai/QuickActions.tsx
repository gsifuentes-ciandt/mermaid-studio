import { Workflow, Wrench, Box, GitBranch, Activity } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';

interface QuickActionsProps {
  onAction: (prompt: string) => void;
}

export const QuickActions = ({ onAction }: QuickActionsProps) => {
  const { t } = useI18n();
  const actions = [
    {
      icon: Workflow,
      label: t('quickActions.workflow'),
      prompt: t('quickActions.prompts.workflow'),
    },
    {
      icon: Wrench,
      label: t('quickActions.endpoint'),
      prompt: t('quickActions.prompts.endpoint'),
    },
    {
      icon: Box,
      label: t('quickActions.architecture'),
      prompt: t('quickActions.prompts.architecture'),
    },
    {
      icon: GitBranch,
      label: t('quickActions.sequence'),
      prompt: t('quickActions.prompts.sequence'),
    },
    {
      icon: Activity,
      label: t('quickActions.state'),
      prompt: t('quickActions.prompts.state'),
    },
  ];

  return (
    <div className="border-t border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800">
      <p className="mb-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
        {t('ai.quickActions')}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => onAction(action.prompt)}
            className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            title={action.prompt}
          >
            <action.icon className="h-3.5 w-3.5" />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};
