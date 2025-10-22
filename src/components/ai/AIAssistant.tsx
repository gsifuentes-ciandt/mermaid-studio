import { X, Minus, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAIStore } from '../../store/aiStore';
import { ChatInterface } from './ChatInterface';
import { useI18n } from '../../contexts/I18nContext';

export const AIAssistant = () => {
  const { isOpen, isCollapsed, close, toggleCollapse } = useAIStore();
  const { t } = useI18n();
  const [size, setSize] = useState({ width: 384, height: 600 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset exit state when opening
  useEffect(() => {
    if (isOpen) {
      setIsExiting(false);
    }
  }, [isOpen]);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle resize logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      // Calculate delta from start position
      const deltaX = resizeStart.x - e.clientX;
      const deltaY = resizeStart.y - e.clientY;

      // Calculate new dimensions based on delta
      const newWidth = Math.max(320, Math.min(800, resizeStart.width + deltaX));
      const newHeight = Math.max(400, Math.min(900, resizeStart.height + deltaY));

      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizing) {
      document.body.style.cursor = 'nwse-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, resizeStart]);

  // Early return AFTER all hooks
  if (!isOpen) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
    setIsResizing(true);
  };

  const handleClose = () => {
    setIsExiting(true);
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      close();
      setIsExiting(false);
    }, 300); // Match animation duration
  };

  return (
    <>
      {/* Backdrop with blur effect - only on mobile */}
      {isMobile && !isCollapsed && (
        <div 
          className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm ${isExiting ? 'animate-fade-out' : 'animate-fade-in'}`}
          onClick={handleClose}
        />
      )}
      
      {/* AI Assistant Panel */}
      <div
        ref={containerRef}
        className={`fixed bottom-6 right-6 z-50 flex flex-col rounded-lg bg-white shadow-2xl ring-2 ring-primary-500/20 dark:bg-gray-900 dark:ring-primary-400/30 md:bottom-6 md:right-6 max-md:inset-0 max-md:bottom-0 max-md:right-0 max-md:rounded-none ${isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}
        style={{
          width: isMobile && !isCollapsed ? '100%' : isCollapsed ? '320px' : `${size.width}px`,
          height: isMobile && !isCollapsed ? '100%' : isCollapsed ? '56px' : `${size.height}px`,
          transition: isCollapsed ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          boxShadow: '0 20px 25px -5px rgba(99, 102, 241, 0.1), 0 10px 10px -5px rgba(99, 102, 241, 0.04), 0 0 40px -10px rgba(99, 102, 241, 0.2)',
        }}
      >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Sparkles className="h-5 w-5 text-primary-600 dark:text-primary-400 animate-pulse" />
            <div className="absolute inset-0 h-5 w-5 animate-ping opacity-20">
              <Sparkles className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {t('ai.title')}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleCollapse}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      )}

      {/* Resize Handle - Hidden on mobile */}
      {!isCollapsed && !isMobile && (
        <div
          className="absolute left-0 top-0 h-full w-2 cursor-ew-resize hover:bg-primary-500/20"
          onMouseDown={handleMouseDown}
        />
      )}
      {!isCollapsed && !isMobile && (
        <div
          className="absolute left-0 top-0 h-2 w-full cursor-ns-resize hover:bg-primary-500/20"
          onMouseDown={handleMouseDown}
        />
      )}
      {!isCollapsed && !isMobile && (
        <div
          className="absolute left-0 top-0 h-4 w-4 cursor-nwse-resize hover:bg-primary-500/30 rounded-tl-lg"
          onMouseDown={handleMouseDown}
        />
      )}
    </div>
    </>
  );
};
