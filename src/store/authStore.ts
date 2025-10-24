// =====================================================
// AUTHENTICATION STORE
// =====================================================
// Zustand store for managing authentication state

import { create } from 'zustand';
import { authService } from '../services/auth.service';
import { isSupabaseConfigured } from '../services/supabase';
import { isDemoMode, mockUser } from '../services/demo.service';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  // State
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  isAuthenticated: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  session: null,
  loading: false,
  initialized: false,
  isAuthenticated: false,

  // Initialize auth state and listen to changes
  initialize: async () => {
    // Demo mode: Use mock user
    if (isDemoMode()) {
      set({
        user: mockUser,
        session: { user: mockUser } as Session,
        isAuthenticated: true,
        initialized: true,
        loading: false,
      });
      return;
    }

    if (!isSupabaseConfigured()) {
      set({ initialized: true, loading: false });
      return;
    }

    set({ loading: true });

    try {
      // Get current session
      const session = await authService.getSession();
      const user = session?.user || null;

      set({
        user,
        session,
        isAuthenticated: !!session,
        initialized: true,
        loading: false,
      });

      // Listen to auth changes
      authService.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event);
        set({
          user: session?.user || null,
          session,
          isAuthenticated: !!session,
        });
      });
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({ initialized: true, loading: false });
    }
  },

  // Sign in with Google
  signIn: async () => {
    set({ loading: true });
    try {
      const { error } = await authService.signInWithGoogle();
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      // Note: User will be redirected to Google OAuth page
      // Session will be set via onAuthStateChange callback after redirect
    } catch (error) {
      console.error('Sign in failed:', error);
      set({ loading: false });
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    set({ loading: true });
    try {
      const { error } = await authService.signOut();
      if (error) throw error;

      set({
        user: null,
        session: null,
        isAuthenticated: false,
        loading: false,
      });
    } catch (error) {
      console.error('Sign out failed:', error);
      set({ loading: false });
      throw error;
    }
  },

  // Refresh session
  refreshSession: async () => {
    try {
      const { session, error } = await authService.refreshSession();
      if (error) throw error;

      set({
        user: session?.user || null,
        session,
        isAuthenticated: !!session,
      });
    } catch (error) {
      console.error('Failed to refresh session:', error);
      throw error;
    }
  },

  // Setters
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSession: (session) => set({ session, user: session?.user || null, isAuthenticated: !!session }),
}));
