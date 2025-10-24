// =====================================================
// CREATE FOLDER MODAL
// =====================================================
// Modal for creating a new folder

import { type ReactElement, useState, useEffect } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { useI18n } from '../../contexts/I18nContext';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  parentFolderId?: string;
  onFolderCreated?: (folder: any) => void;
}

export function CreateFolderModal({ isOpen, onClose, projectId, parentFolderId: initialParentFolderId, onFolderCreated }: CreateFolderModalProps): ReactElement {
  const { t } = useI18n();
  const { createFolder, folders } = useProjectStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentFolderId, setParentFolderId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Get folders for this project
  const projectFolders = folders.filter(f => f.project_id === projectId);

  // Set initial parent folder when modal opens
  useEffect(() => {
    if (isOpen && initialParentFolderId) {
      setParentFolderId(initialParentFolderId);
    } else if (!isOpen) {
      // Reset when modal closes
      setParentFolderId('');
    }
  }, [isOpen, initialParentFolderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(t('folder.folderName'));
      return;
    }

    setLoading(true);
    try {
      const newFolder = await createFolder({
        project_id: projectId,
        name: name.trim(),
        description: description.trim() || undefined,
        parent_folder_id: parentFolderId || undefined,
      });
      
      toast.success(t('folder.createSuccess'));
      
      // Call callback with new folder object if provided
      if (onFolderCreated && newFolder) {
        onFolderCreated(newFolder);
      }
      
      onClose();
      setName('');
      setDescription('');
      setParentFolderId('');
    } catch (error) {
      console.error('Failed to create folder:', error);
      toast.error(t('folder.createError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('folder.createTitle')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('folder.folderName')} *
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('folder.folderNamePlaceholder')}
            maxLength={100}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('folder.parentFolder')}
          </label>
          <Select
            value={parentFolderId}
            onChange={(e) => setParentFolderId(e.target.value)}
          >
            <option value="">{t('folder.rootLevel')}</option>
            {projectFolders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </Select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Select a parent folder to create a nested folder
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('folder.description')}
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('folder.descriptionPlaceholder')}
            rows={3}
            maxLength={500}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            {t('folder.cancel')}
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? t('folder.create') + '...' : t('folder.create')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
