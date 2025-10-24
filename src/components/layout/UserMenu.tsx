// =====================================================
// USER MENU
// =====================================================
// User account dropdown menu with sign in/out and preferences

import { useState, useRef, useEffect } from 'react';
import { User, LogIn, LogOut, Settings, ChevronDown } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import toast from 'react-hot-toast';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export function UserMenu(): JSX.Element {
  const { t } = useI18n();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await authService.getUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Listen to auth state changes
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleSignIn = async () => {
    try {
      const { error } = await authService.signInWithGoogle();
      if (error) {
        toast.error(error.message || t('userMenu.signInError'));
      }
    } catch (error) {
      toast.error(t('userMenu.signInError'));
    }
    setShowMenu(false);
  };

  const handleSignOut = async () => {
    try {
      const { error } = await authService.signOut();
      if (error) {
        toast.error(error.message || t('userMenu.signOutError'));
      } else {
        toast.success(t('userMenu.signOutSuccess'));
        navigate('/');
      }
    } catch (error) {
      toast.error(t('userMenu.signOutError'));
    }
    setShowMenu(false);
  };

  const handlePreferences = () => {
    navigate('/settings');
    setShowMenu(false);
  };

  if (loading) {
    return (
      <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
    );
  }

  // Get user initials or first letter of email
  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(' ');
      return names.length > 1
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0][0].toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || '?';
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 transition ${
          user
            ? 'bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30'
            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        title={user ? user.email : 'Sign in'}
      >
        {user ? (
          <>
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt={user.user_metadata?.full_name || 'User'}
                className="h-7 w-7 rounded-full object-cover"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`h-7 w-7 rounded-full bg-primary-500 dark:bg-primary-600 flex items-center justify-center ${user.user_metadata?.avatar_url ? 'hidden' : ''}`}>
              <span className="text-xs font-semibold text-white">
                {getUserInitials()}
              </span>
            </div>
            <ChevronDown size={14} className="text-gray-500 dark:text-gray-400" />
          </>
        ) : (
          <>
            <User size={16} className="text-gray-700 dark:text-gray-300" />
            <ChevronDown size={14} className="text-gray-500 dark:text-gray-400" />
          </>
        )}
      </button>

      {showMenu && (
        <div className="absolute right-0 top-full z-[100] mt-2 w-64 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
          {user ? (
            <>
              {/* User Info */}
              <div className="border-b border-gray-200 dark:border-gray-700 p-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user.user_metadata?.full_name || 'User'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  onClick={handlePreferences}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings size={16} className="text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{t('userMenu.preferences')}</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut size={16} className="text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{t('userMenu.signOut')}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-1">
              <button
                onClick={handleSignIn}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogIn size={16} className="text-gray-600 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white">{t('userMenu.signIn')}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
