// =====================================================
// LOGIN PAGE
// =====================================================
// Authentication page with Google Sign-In

import { type ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Chrome } from 'lucide-react';
import toast from 'react-hot-toast';

export function LoginPage(): ReactElement {
  const navigate = useNavigate();
  const { signIn } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn();
      // User will be redirected to Google OAuth
      // After successful auth, they'll be redirected back to /auth/callback
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 via-purple-600 to-purple-700 p-4">
      <div className="bg-gray-900 dark:bg-gray-800 p-10 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center shadow-lg">
            <img 
              src="/mermaid-studio-logo.png" 
              alt="Mermaid Studio Pro" 
              className="h-10 w-10"
              onError={(e) => {
                // Fallback if logo doesn't exist
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-3 text-white">
          Mermaid Studio Pro
        </h1>
        <p className="text-gray-300 text-center mb-10 text-sm">
          Create beautiful diagrams with AI and your team
        </p>

        {/* Sign In Button */}
        <Button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3.5 text-base bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg transition-all"
        >
          <Chrome className="h-5 w-5" />
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </Button>

        {/* Terms */}
        <p className="text-xs text-gray-400 text-center mt-6">
          By signing in, you agree to our{' '}
          <span className="text-primary-400 hover:text-primary-300 cursor-pointer">Terms of Service</span>
          {' '}and{' '}
          <span className="text-primary-400 hover:text-primary-300 cursor-pointer">Privacy Policy</span>
        </p>

        {/* Local Mode Link */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <button
            onClick={() => {
              // Disable Supabase mode to use local-only mode
              localStorage.removeItem('DEMO_MODE');
              window.location.href = '/';
            }}
            className="text-sm text-gray-400 hover:text-primary-400 w-full text-center transition-colors"
          >
            Continue without signing in (local mode)
          </button>
        </div>
      </div>
    </div>
  );
}
