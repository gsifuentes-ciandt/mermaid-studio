// =====================================================
// AUTHENTICATION SERVICE
// =====================================================
// Handles user authentication with Google OAuth via Supabase

import { supabase, isSupabaseConfigured } from './supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

export interface AuthResult {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

class AuthService {
  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(): Promise<{ error: AuthError | null }> {
    if (!isSupabaseConfigured()) {
      return {
        error: {
          message: 'Supabase not configured. Please set up your environment variables.',
          name: 'ConfigurationError',
          status: 500,
        } as AuthError,
      };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    return { error };
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  /**
   * Get current session
   */
  async getSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  /**
   * Get current user
   */
  async getUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }

  /**
   * Refresh session
   */
  async refreshSession(): Promise<{ session: Session | null; error: AuthError | null }> {
    const { data, error } = await supabase.auth.refreshSession();
    return { session: data.session, error };
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();
    return !!session;
  }

  /**
   * Get user ID
   */
  async getUserId(): Promise<string | null> {
    const user = await this.getUser();
    return user?.id || null;
  }
}

export const authService = new AuthService();
