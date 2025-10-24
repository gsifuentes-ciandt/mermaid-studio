// =====================================================
// PROJECT SETTINGS MODAL
// =====================================================
// Modal for editing project settings

import { type ReactElement, useState, type FormEvent } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import type { Project } from '../../types/collaboration.types';
import { useProjectStore } from '../../store/projectStore';
import toast from 'react-hot-toast';

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export function ProjectSettingsModal({ isOpen, onClose, project }: ProjectSettingsModalProps): ReactElement {
  const { t } = useI18n();
  const { updateProject } = useProjectStore();
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || '');
  const [visibility, setVisibility] = useState<'private' | 'team'>(project.visibility);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error(t('projectSettings.projectName'));
      return;
    }

    setLoading(true);
    try {
      await updateProject(project.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        visibility,
      });
      toast.success(t('projectSettings.saveSuccess'));
      onClose();
    } catch (error) {
      toast.error(t('projectSettings.saveError'));
      console.error('Error updating project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('projectSettings.title')}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Name */}
        <div>
          <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('projectSettings.projectName')}
          </label>
          <Input
            id="project-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('projectSettings.projectNamePlaceholder')}
            required
            maxLength={100}
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('projectSettings.description')}
          </label>
          <Textarea
            id="project-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('projectSettings.descriptionPlaceholder')}
            rows={3}
            maxLength={500}
          />
        </div>

        {/* Visibility */}
        <div>
          <label htmlFor="project-visibility" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('projectSettings.visibility')}
          </label>
          <Select
            id="project-visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as 'private' | 'team')}
          >
            <option value="private">{t('projectSettings.private')}</option>
            <option value="team">{t('projectSettings.team')}</option>
          </Select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {visibility === 'private' 
              ? 'Only invited members can access this project'
              : 'Team members can discover and request access to this project'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            {t('projectSettings.cancel')}
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? t('projectSettings.save') + '...' : t('projectSettings.save')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
