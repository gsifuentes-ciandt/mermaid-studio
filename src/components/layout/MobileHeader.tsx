// =====================================================
// MOBILE HEADER
// =====================================================
// Header for mobile devices with hamburger menu

import { type ReactElement } from 'react';
import { Button } from '../ui/Button';
import { Menu, ArrowLeft, Settings, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../../types/collaboration.types';

interface MobileHeaderProps {
  project: Project;
  onMenuClick: () => void;
  onShare: () => void;
  onSettings: () => void;
}

export function MobileHeader({ project, onMenuClick, onShare, onSettings }: MobileHeaderProps): ReactElement {
  const navigate = useNavigate();

  return (
    <div className="lg:hidden border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate flex-1 mx-2">
          {project.name}
        </h1>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            className="text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettings}
            className="text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
