import { type ReactElement, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout/Layout';
import { Header } from './components/layout/Header';
import { DiagramGrid } from './components/diagram/DiagramGrid';
import { SearchFilterBar } from './components/layout/SearchFilterBar';
import { Toolbar } from './components/layout/Toolbar';
import { DiagramModal } from './components/modals/DiagramModal';
import { InfoModal } from './components/modals/InfoModal';
import { ZoomModal } from './components/zoom/ZoomModal';
import { AIButton } from './components/ai/AIButton';
import { AIAssistant } from './components/ai/AIAssistant';
import { DiffPreview } from './components/ai/DiffPreview';
import { useAIStore } from './store/aiStore';

function App(): ReactElement {
  const { open } = useAIStore();

  // Keyboard shortcut: Cmd+K or Ctrl+K to open AI
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        open();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <Header />
        <Toolbar />
        <SearchFilterBar />
        <DiagramGrid />
      </div>
      <DiagramModal />
      <InfoModal />
      <ZoomModal />
      
      {/* AI Components */}
      <AIButton />
      <AIAssistant />
      <DiffPreview />
      
      <Toaster position="top-center" gutter={12} />
    </Layout>
  );
}

export default App;
