import { type ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-100 dark:from-gray-900 dark:to-gray-800">
      <AppHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
