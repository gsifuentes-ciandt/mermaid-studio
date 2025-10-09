import { type ReactNode } from 'react';
import { AppHeader } from './AppHeader';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-purple-600 dark:from-gray-900 dark:to-gray-800">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
