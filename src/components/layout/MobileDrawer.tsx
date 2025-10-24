// =====================================================
// MOBILE DRAWER
// =====================================================
// Slide-out navigation drawer for mobile

import { type ReactElement, type ReactNode } from 'react';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
}

export function MobileDrawer({ isOpen, onClose, children, title }: MobileDrawerProps): ReactElement {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`
          fixed top-0 left-0 h-full w-80 max-w-[85vw]
          bg-white dark:bg-gray-800 shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          lg:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {children}
        </div>
      </div>
    </>
  );
}
