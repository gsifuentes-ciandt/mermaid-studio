// =====================================================
// FOLDER LIST
// =====================================================
// List of folders in sidebar with nested hierarchy support

import { type ReactElement, useState, useEffect, useRef } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { useProjectPermissions } from '../../hooks/useProjectPermissions';
import { useI18n } from '../../contexts/I18nContext';
import { Folder as FolderIcon, ChevronRight, ChevronDown, MoreVertical, Edit2, Trash2, FolderPlus } from 'lucide-react';
import type { Folder } from '../../types/collaboration.types';
import { FolderSkeleton } from '../ui/Skeleton';

interface FolderListProps {
  folders: Folder[];
  loading?: boolean;
  onEdit?: (folder: Folder) => void;
  onDelete?: (folder: Folder) => void;
  onAddSubfolder?: (parentFolder: Folder) => void;
}

interface FolderItemProps {
  folder: Folder;
  level: number;
  children?: Folder[];
  allFolders: Folder[];
  onEdit?: (folder: Folder) => void;
  onDelete?: (folder: Folder) => void;
  onAddSubfolder?: (parentFolder: Folder) => void;
}

function FolderItem({ folder, level, children = [], allFolders, onEdit, onDelete, onAddSubfolder }: FolderItemProps): ReactElement {
  const { t } = useI18n();
  const { currentFolder, setCurrentFolder } = useProjectStore();
  const permissions = useProjectPermissions();
  const [isExpanded, setIsExpanded] = useState(folder.isExpanded ?? false);
  const [draggedOver, setDraggedOver] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hasChildren = children.length > 0;

  // Sync local state with folder prop
  useEffect(() => {
    setIsExpanded(folder.isExpanded ?? false);
  }, [folder.isExpanded]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    
    // Update the folder in the store to persist the state
    useProjectStore.setState((state) => ({
      folders: state.folders.map((f) =>
        f.id === folder.id ? { ...f, isExpanded: newExpandedState } : f
      ),
    }));
  };

  const handleClick = () => {
    setCurrentFolder(folder);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('folderId', folder.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    setDraggedOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedId = e.dataTransfer.getData('folderId');
    
    if (draggedId && draggedId !== folder.id) {
      // Check if trying to drop a folder into itself or its descendant
      const isDescendant = (parentId: string, childId: string): boolean => {
        const child = allFolders.find(f => f.id === childId);
        if (!child || !child.parent_folder_id) return false;
        if (child.parent_folder_id === parentId) return true;
        return isDescendant(parentId, child.parent_folder_id);
      };

      if (isDescendant(draggedId, folder.id)) {
        console.warn('Cannot move folder into its own descendant');
        setDraggedOver(false);
        return;
      }

      // Find indices for reordering
      const draggedIndex = allFolders.findIndex(f => f.id === draggedId);
      const targetIndex = allFolders.findIndex(f => f.id === folder.id);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        // Reorder locally
        const newFolders = [...allFolders];
        const [removed] = newFolders.splice(draggedIndex, 1);
        newFolders.splice(targetIndex, 0, removed);
        
        // Update store (optimistic update)
        useProjectStore.setState({ folders: newFolders });
        
        console.log('Folders reordered:', newFolders.map(f => f.name));
        // TODO: Update sort_order in database
      }
    }
    
    setDraggedOver(false);
  };

  const handleDragEnd = () => {
    setDraggedOver(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      className={`relative ${draggedOver ? 'mt-6' : ''}`}
    >
      {/* Drop Indicator Line */}
      {draggedOver && (
        <div className="absolute -top-1 left-0 right-0 h-0.5 bg-primary-500 rounded-full shadow-lg shadow-primary-500/50" />
      )}
      <div className="group relative" ref={menuRef}>
        <button
          onClick={handleClick}
          className={`w-full flex items-center gap-1 px-2 py-2 rounded-lg transition-colors text-left ${
            currentFolder?.id === folder.id
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          style={{ paddingLeft: `${level * 12 + 12}px` }}
        >
          {hasChildren ? (
            <button
              onClick={handleToggle}
              className="flex-shrink-0 w-5 h-5 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="w-5 h-5 flex-shrink-0" />
          )}
          <FolderIcon className="h-4 w-4 flex-shrink-0 ml-0.5" />
          <span className="flex-1 truncate text-sm font-medium" title={folder.name}>{folder.name}</span>
          {folder.diagram_count !== undefined && folder.diagram_count > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
              {folder.diagram_count}
            </span>
          )}
          
          {/* Ellipsis Button - Only for editors/admins/owners */}
          {permissions.canEditFolder && (onEdit || onDelete || onAddSubfolder) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-all"
              title="More options"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          )}
        </button>
        
        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute right-2 top-full mt-1 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[160px]">
            {onAddSubfolder && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onAddSubfolder(folder);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FolderPlus className="h-4 w-4" />
                {t('folder.addSubfolder')}
              </button>
            )}
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onEdit(folder);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                {t('folder.edit')}
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onDelete(folder);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                {t('folder.delete')}
              </button>
            )}
          </div>
        )}
      </div>
      
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {children.map((child) => (
            <FolderItem
              key={child.id}
              folder={child}
              level={level + 1}
              children={buildFolderTree(allFolders, child.id)}
              allFolders={allFolders}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddSubfolder={onAddSubfolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Build folder tree structure
function buildFolderTree(folders: Folder[], parentId: string | null = null): Folder[] {
  return folders
    .filter(f => f.parent_folder_id === parentId)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function FolderList({ folders, loading = false, onEdit, onDelete, onAddSubfolder }: FolderListProps): ReactElement {
  if (loading) {
    return <FolderSkeleton />;
  }
  
  if (folders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
        No folders yet
      </div>
    );
  }

  // Get root folders (no parent)
  const rootFolders = buildFolderTree(folders, null);

  return (
    <div className="space-y-1">
      {rootFolders.map((folder) => (
        <FolderItem
          key={folder.id}
          folder={folder}
          level={0}
          children={buildFolderTree(folders, folder.id)}
          allFolders={folders}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddSubfolder={onAddSubfolder}
        />
      ))}
    </div>
  );
}
