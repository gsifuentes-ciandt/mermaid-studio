import { useEffect, useState, useRef } from 'react';
import { X, ZoomIn, ZoomOut, Maximize2, Move } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useDiagramStore } from '@/store/diagramStore';
import { useMermaidRenderer } from '@/hooks/useMermaidRenderer';

export function ZoomModal(): JSX.Element | null {
  const { isOpen, diagramId } = useUIStore((state) => state.zoomModal);
  const closeZoomModal = useUIStore((state) => state.closeZoomModal);
  const diagrams = useDiagramStore((state) => state.diagrams);

  const diagram = diagramId ? diagrams.find((d) => d.name === diagramId) : undefined;
  const { svg } = useMermaidRenderer(diagram?.code || '');

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [focusMode, setFocusMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      // Prevent background scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore background scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          closeZoomModal();
          break;
        case '+':
        case '=':
          setScale((s) => Math.min(s + 0.1, 5));
          break;
        case '-':
          setScale((s) => Math.max(s - 0.1, 0.1));
          break;
        case '0':
          setScale(1);
          setPosition({ x: 0, y: 0 });
          break;
        case 'f':
        case 'F':
          setFocusMode((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeZoomModal]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.1, Math.min(5, scale + delta));
    
    if (newScale === scale) return; // No change in scale
    
    // Get mouse position relative to the container
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate the point under the mouse in the scaled coordinate system
    const pointX = (mouseX - rect.width / 2 - position.x) / scale;
    const pointY = (mouseY - rect.height / 2 - position.y) / scale;
    
    // Calculate new position to keep the point under the mouse
    const newPosition = {
      x: mouseX - rect.width / 2 - pointX * newScale,
      y: mouseY - rect.height / 2 - pointY * newScale
    };
    
    setScale(newScale);
    setPosition(newPosition);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 5));
  const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.1));
  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  if (!isOpen || !diagram) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 dark:bg-gray-950/98">
      {/* Close Button - Always visible */}
      <button
        onClick={closeZoomModal}
        className="fixed right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-lg bg-white/90 text-gray-900 shadow-lg transition hover:bg-white dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        aria-label="Close"
      >
        <X size={24} />
      </button>

      {/* Focus Mode Toggle - Always visible */}
      <button
        onClick={() => setFocusMode(!focusMode)}
        className="fixed right-20 top-5 z-10 flex h-12 items-center gap-2 rounded-lg bg-white/90 px-4 text-gray-900 shadow-lg transition hover:bg-white dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        title={focusMode ? 'Exit Focus Mode (F)' : 'Enter Focus Mode (F)'}
      >
        {focusMode ? '👁️' : '🎯'}
        <span className="text-sm font-semibold">{focusMode ? 'Exit Focus' : 'Focus'}</span>
      </button>

      {/* Info Panel */}
      {!focusMode && (
        <div className="fixed left-5 top-5 z-10 max-w-md rounded-xl bg-white/90 p-4 shadow-lg backdrop-blur dark:bg-gray-800/90">
          <h3 className="mb-2 text-lg font-bold text-primary-600 dark:text-primary-400">{diagram.title}</h3>
          {diagram.description && (
            <p className="text-sm text-gray-700 dark:text-gray-300">{diagram.description}</p>
          )}
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Type:</span> {diagram.type}
          </div>
        </div>
      )}

      {/* Zoom Controls */}
      {!focusMode && (
        <div className="fixed right-5 top-20 z-10 flex flex-col gap-2">
        <button
          onClick={zoomIn}
          className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/90 shadow-lg transition hover:bg-white dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          title="Zoom In (+)"
        >
          <ZoomIn size={20} />
        </button>
        <button
          onClick={zoomOut}
          className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/90 shadow-lg transition hover:bg-white dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          title="Zoom Out (-)"
        >
          <ZoomOut size={20} />
        </button>
        <button
          onClick={resetZoom}
          className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/90 shadow-lg transition hover:bg-white dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          title="Reset (0)"
        >
          <Maximize2 size={20} />
        </button>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/90 text-sm font-bold shadow-lg dark:bg-gray-800 dark:text-white">
          {Math.round(scale * 100)}%
        </div>
        </div>
      )}

      {/* Keyboard Help */}
      {!focusMode && (
        <div className="fixed bottom-5 left-5 z-10 rounded-lg bg-white/90 p-3 text-xs shadow-lg backdrop-blur dark:bg-gray-800/90">
        <div className="mb-2 font-bold text-primary-600 dark:text-primary-400">⌨️ Keyboard Shortcuts</div>
        <div className="space-y-1 text-gray-700 dark:text-gray-300">
          <div className="flex justify-between gap-4">
            <span>Zoom In:</span>
            <kbd className="rounded bg-gray-200 px-2 py-0.5 font-mono dark:bg-gray-700">+</kbd>
          </div>
          <div className="flex justify-between gap-4">
            <span>Zoom Out:</span>
            <kbd className="rounded bg-gray-200 px-2 py-0.5 font-mono dark:bg-gray-700">-</kbd>
          </div>
          <div className="flex justify-between gap-4">
            <span>Reset:</span>
            <kbd className="rounded bg-gray-200 px-2 py-0.5 font-mono dark:bg-gray-700">0</kbd>
          </div>
          <div className="flex justify-between gap-4">
            <span>Close:</span>
            <kbd className="rounded bg-gray-200 px-2 py-0.5 font-mono dark:bg-gray-700">Esc</kbd>
          </div>
          <div className="flex justify-between gap-4">
            <span>Focus Mode:</span>
            <kbd className="rounded bg-gray-200 px-2 py-0.5 font-mono dark:bg-gray-700">F</kbd>
          </div>
          <div className="mt-2 flex items-center gap-2 border-t border-gray-300 pt-2 dark:border-gray-600">
            <Move size={14} />
            <span>Click & drag to pan</span>
          </div>
        </div>
        </div>
      )}

      {/* Diagram Container */}
      <div
        ref={containerRef}
        className={`h-full w-full overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="flex h-full w-full items-center justify-center"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          {svg && (
            <div
              className="inline-block bg-white p-8 rounded-lg shadow-2xl"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
