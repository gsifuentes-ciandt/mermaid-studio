// =====================================================
// COLLAPSIBLE SIDEBAR
// =====================================================
// Reusable collapsible sidebar with localStorage persistence

import { type ReactElement, type ReactNode } from 'react';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react';

interface CollapsibleSidebarProps {
  children: ReactNode;
  isCollapsed: boolean;
  onToggle: () => void;
  side: 'left' | 'right';
  title?: string;
  icon?: LucideIcon;
}

export function CollapsibleSidebar({
  children,
  isCollapsed,
  onToggle,
  side,
  title,
  icon: Icon,
}: CollapsibleSidebarProps): ReactElement {
  return (
    <div
      className={`
        relative border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800
        transition-all duration-300 ease-in-out overflow-hidden h-full
        ${side === 'left' ? 'border-r' : 'border-l'}
        ${isCollapsed ? 'w-14' : 'w-64'}
      `}
    >
      {/* Content */}
      <div className={`h-full overflow-y-auto ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}>
        {title && !isCollapsed && (
          <div className="px-4 pt-4 pb-2 flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-gray-700 dark:text-gray-300" />}
            <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          </div>
        )}
        {!isCollapsed && children}
      </div>

      {/* Collapsed State - Show icon and expand button */}
      {isCollapsed && (
        <div className="absolute top-0 left-0 right-0 flex flex-col items-center pt-4 gap-3">
          {Icon && (
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
              <Icon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
            title={`Expand ${title || 'Sidebar'}`}
          >
            {side === 'left' ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
      )}

      {/* Expanded State - Show collapse button */}
      {!isCollapsed && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={`
            absolute top-4 z-10 vertical-align-middle items-center
            bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600
            text-gray-700 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-600
            ${side === 'left' ? 'right-2' : 'left-2'}
          `}
          title="Collapse"
        >
          {side === 'left' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
}
