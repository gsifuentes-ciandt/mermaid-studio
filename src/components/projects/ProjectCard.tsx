// =====================================================
// PROJECT CARD
// =====================================================
// Card component for displaying project in dashboard

import { type ReactElement, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../contexts/I18nContext';
import { Button } from '../ui/Button';
import { FileText, Users, FolderOpen, MoreVertical, Settings, Trash2 } from 'lucide-react';
import { authService } from '../../services/auth.service';
import type { Project } from '../../types/collaboration.types';

interface ProjectCardProps {
  project: Project;
  onSettings?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export function ProjectCard({ project, onSettings, onDelete }: ProjectCardProps): ReactElement {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // Check if current user is the owner
  useEffect(() => {
    const checkOwnership = async () => {
      const user = await authService.getUser();
      setIsOwner(user?.id === project.owner_id);
    };
    checkOwnership();
  }, [project.owner_id]);

  const handleOpen = () => {
    navigate(`/project/${project.id}`);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onSettings) {
      onSettings(project);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onDelete) {
      onDelete(project);
    }
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const updated = new Date(date);
    const diffMs = now.getTime() - updated.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return updated.toLocaleDateString();
  };

  return (
    <div 
      onClick={handleOpen}
      className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md border-2 border-gray-200 dark:border-gray-700 p-6 cursor-pointer transition-all duration-200 hover:shadow-2xl hover:border-primary-400 hover:scale-[1.02] dark:hover:border-primary-500"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {project.name}
          </h3>
          {project.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {project.description}
            </p>
          )}
        </div>
        {isOwner && (
          <div className="relative">
            <button 
              onClick={handleMenuClick}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            
            {/* Dropdown Menu */}
            {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
              <button
                onClick={handleSettings}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Settings className="h-4 w-4" />
                {t('projectSettings.settings')}
              </button>
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                {t('projectSettings.deleteProject')}
              </button>
            </div>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
        <div className="flex items-center gap-1 whitespace-nowrap">
          <FileText className="h-4 w-4 flex-shrink-0" />
          <span>{t('project.diagramCount').replace('{count}', String(project.diagram_count || 0))}</span>
        </div>
        <div className="flex items-center gap-1 whitespace-nowrap">
          <FolderOpen className="h-4 w-4 flex-shrink-0" />
          <span>{t('project.folderCount').replace('{count}', String(project.folder_count || 0))}</span>
        </div>
        <div className="flex items-center gap-1 whitespace-nowrap">
          <Users className="h-4 w-4 flex-shrink-0" />
          <span>{t('share.memberCount').replace('{count}', String(project.member_count || 1))}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Updated {timeAgo(project.updated_at)}
        </span>
      </div>
    </div>
  );
}
