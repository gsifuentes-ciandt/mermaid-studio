// =====================================================
// AUTH CALLBACK PAGE
// =====================================================
// Handles OAuth redirect after Google authentication

import { type ReactElement, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function AuthCallbackPage(): ReactElement {
  const navigate = useNavigate();
  const { initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth to process the OAuth callback
    initialize().then(() => {
      // Redirect to dashboard after successful auth
      navigate('/dashboard');
    }).catch((error) => {
      console.error('Auth callback error:', error);
      // Redirect to login on error
      navigate('/login');
    });
  }, [initialize, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-purple-600">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Completing sign in...
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Please wait while we set up your account
        </p>
      </div>
    </div>
  );
}
