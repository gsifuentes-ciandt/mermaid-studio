// =====================================================
// PROJECT HEADER
// =====================================================
// Header component for project page

import { type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ArrowLeft, Share2, Settings } from 'lucide-react';
import { useProjectPermissions } from '../../hooks/useProjectPermissions';
import type { Project } from '../../types/collaboration.types';

interface ProjectHeaderProps {
  project: Project;
  onShare: () => void;
  onSettings?: () => void;
}

export function ProjectHeader({ project, onShare, onSettings }: ProjectHeaderProps): ReactElement {
  const navigate = useNavigate();
  const permissions = useProjectPermissions();

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {project.name}
            </h1>
            {project.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {project.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          {permissions.canEditProject && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onSettings}
              className="text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-600"
              title="Project Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
