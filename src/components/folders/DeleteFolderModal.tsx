// =====================================================
// DELETE FOLDER MODAL
// =====================================================
// Modal for deleting folder with safety confirmation

import { type ReactElement, useState, useEffect } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { useI18n } from '../../contexts/I18nContext';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';
import type { Folder } from '../../types/collaboration.types';
import toast from 'react-hot-toast';

interface DeleteFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder | null;
}

export function DeleteFolderModal({ isOpen, onClose, folder }: DeleteFolderModalProps): ReactElement {
  const { t } = useI18n();
  const { deleteFolder } = useProjectStore();
  const [confirmName, setConfirmName] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagramCount, setDiagramCount] = useState(0);

  // Reset confirm name when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setConfirmName('');
      setDiagramCount(0);
    }
  }, [isOpen]);

  // Fetch diagram count when folder changes
  useEffect(() => {
    if (folder && isOpen) {
      // Use the diagram_count from folder if available, otherwise default to 0
      const count = folder.diagram_count || 0;
      console.log('Delete modal - folder:', folder.name, 'diagram_count:', folder.diagram_count, 'using:', count);
      setDiagramCount(count);
    }
  }, [folder, isOpen]);

  if (!folder) return <></>;

  const hasDiagrams = diagramCount > 0;
  const canDelete = !hasDiagrams || confirmName === folder.name;

  const handleDelete = async () => {
    if (!canDelete) return;

    setLoading(true);
    try {
      await deleteFolder(folder.id);
      toast.success(t('folder.deleteSuccess'));
      onClose();
    } catch (error) {
      console.error('Failed to delete folder:', error);
      toast.error(t('folder.deleteError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${t('folder.delete')}: ${folder.name}`}>
      <div className="space-y-4">
        {/* Warning */}
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">
              {t('folder.deleteWarning')}
            </h4>
            <p className="text-sm text-red-800 dark:text-red-200">
              {hasDiagrams ? (
                <>
                  This folder contains <strong>{diagramCount} diagram{diagramCount !== 1 ? 's' : ''}</strong>.
                  Deleting it will permanently remove all diagrams inside.
                </>
              ) : (
                'This folder is empty and will be permanently deleted.'
              )}
            </p>
          </div>
        </div>

        {/* Folder Info */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Folder to delete:</p>
          <p className="font-semibold text-gray-900 dark:text-white">{folder.name}</p>
          {folder.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{folder.description}</p>
          )}
        </div>

        {/* Confirmation Input (only if folder has diagrams) */}
        {hasDiagrams && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('folder.deleteWithDiagrams').replace('{count}', String(diagramCount))}
            </label>
            <Input
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder={t('folder.confirmPlaceholder')}
              autoComplete="off"
            />
            {confirmName && confirmName !== folder.name && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                Folder name doesn't match
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t('folder.cancel')}
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleDelete}
            disabled={!canDelete || loading}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
          >
            {loading ? t('folder.delete') + '...' : t('folder.delete')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
