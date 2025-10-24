// =====================================================
// APP ROUTER
// =====================================================
// Main application routing with authentication

import { type ReactElement, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { isSupabaseConfigured } from './services/supabase';
import { isDemoMode } from './services/demo.service';
import { aiService } from './services/ai/ai.service';

// Pages
import { LoginPage } from './pages/LoginPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectPage } from './pages/ProjectPage';
import { SettingsPage } from './pages/SettingsPage';

// Legacy App (for local mode)
import App from './App';

// Layouts
import { AuthenticatedLayout } from './components/layout/AuthenticatedLayout';

// Protected Route Component
function ProtectedRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated, initialized } = useAuthStore();

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function AppRouter(): ReactElement {
  const { initialize, initialized, user } = useAuthStore();
  const supabaseConfigured = isSupabaseConfigured();
  const demoMode = isDemoMode();

  useEffect(() => {
    if (supabaseConfigured || demoMode) {
      initialize();
    }
  }, [initialize, supabaseConfigured, demoMode]);
  
  // Update AI service with user credentials when user changes
  useEffect(() => {
    console.log('👤 AppRouter: User changed:', user ? `ID: ${user.id}, Email: ${user.email}` : 'No user');
    if (user) {
      console.log('🔄 Calling aiService.setUser with user ID:', user.id);
      aiService.setUser(user.id);
    } else {
      console.log('🔄 Calling aiService.setUser with undefined (no user)');
      aiService.setUser(undefined);
    }
  }, [user]);

  // If Supabase is not configured and not in demo mode, use legacy local-only mode
  if (!supabaseConfigured && !demoMode) {
    return <App />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <DashboardPage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:projectId"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <ProjectPage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <SettingsPage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirect root to dashboard or login */}
        <Route
          path="/"
          element={
            initialized && (supabaseConfigured || demoMode) ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
