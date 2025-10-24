// =====================================================
// EDIT FOLDER MODAL
// =====================================================
// Modal for editing folder name and description

import { type ReactElement, useState, useEffect } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { useI18n } from '../../contexts/I18nContext';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import type { Folder } from '../../types/collaboration.types';
import toast from 'react-hot-toast';

interface EditFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder | null;
}

export function EditFolderModal({ isOpen, onClose, folder }: EditFolderModalProps): ReactElement {
  const { t } = useI18n();
  const { updateFolder } = useProjectStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Update form when folder changes
  useEffect(() => {
    if (folder) {
      setName(folder.name);
      setDescription(folder.description || '');
    }
  }, [folder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folder) return;
    
    if (!name.trim()) {
      toast.error(t('folder.folderName'));
      return;
    }

    setLoading(true);
    try {
      await updateFolder(folder.id, {
        name: name.trim(),
        description: description.trim() || undefined,
      });
      toast.success(t('folder.updateSuccess'));
      onClose();
    } catch (error) {
      console.error('Failed to update folder:', error);
      toast.error(t('folder.updateError'));
    } finally {
      setLoading(false);
    }
  };

  if (!folder) return <></>;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('folder.editTitle')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('folder.folderName')}
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('folder.folderNamePlaceholder')}
            required
          />
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
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t('folder.cancel')}
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? t('folder.save') + '...' : t('folder.save')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
