// =====================================================
// AUTHENTICATED LAYOUT
// =====================================================
// Layout for authenticated users with sidebar and header

import { type ReactElement, type ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { AppHeader } from './AppHeader';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { AIButton } from '../ai/AIButton';
import { AIAssistant } from '../ai/AIAssistant';
import { DiffPreview } from '../ai/DiffPreview';
import { isDemoMode, disableDemoMode } from '../../services/demo.service';
import { AlertCircle, X } from 'lucide-react';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps): ReactElement {
  const demoMode = isDemoMode();

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Demo Mode Banner */}
      {demoMode && (
        <div className="bg-amber-500 dark:bg-amber-600 text-white px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">
              Demo Mode Active - Using mock data. No changes will be saved.
            </span>
          </div>
          <button
            onClick={() => disableDemoMode()}
            className="flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded transition text-sm font-medium"
          >
            <X className="h-4 w-4" />
            Exit Demo
          </button>
        </div>
      )}

      {/* Header */}
      <AppHeader />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Footer - Full Width */}
      <Footer />

      {/* AI Components */}
      <AIButton />
      <AIAssistant />
      <DiffPreview />

      {/* Toast Notifications */}
      <Toaster position="top-center" gutter={12} />
    </div>
  );
}
