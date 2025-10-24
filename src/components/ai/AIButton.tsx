import { Sparkles } from 'lucide-react';
import { useAIStore } from '../../store/aiStore';

export const AIButton = () => {
  const { open, isOpen } = useAIStore();

  if (isOpen) return null;

  return (
    <div className="fixed bottom-12 right-6 z-40 animate-bounce-in">
      {/* Pulsing glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 opacity-30 animate-pulse" />
      
      {/* Main button */}
      <button
        onClick={open}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg ring-2 ring-primary-400/50 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:ring-4 hover:ring-primary-400/60 active:scale-95 dark:shadow-primary-500/30"
        style={{
          boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4), 0 0 30px -5px rgba(147, 51, 234, 0.3)',
        }}
        aria-label="Open AI Assistant"
        title="AI Assistant (Cmd+K)"
      >
        <Sparkles className="h-6 w-6 animate-pulse" />
      </button>
    </div>
  );
};
