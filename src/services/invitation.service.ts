// =====================================================
// INVITATION SERVICE
// =====================================================
// Handles project invitations and member management

import { supabase, isSupabaseConfigured } from './supabase';
import type { ProjectRole } from '../types/collaboration.types';

export interface Invitation {
  id: string;
  project_id: string;
  email: string;
  role: ProjectRole;
  invited_by: string;
  invited_at: string;
  status: 'pending' | 'accepted' | 'declined';
}

class InvitationService {
  /**
   * Invite a user to a project by email
   */
  async inviteUser(projectId: string, email: string, role: ProjectRole): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      // Check if user exists in public.users table
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle(); // Use maybeSingle instead of single to avoid error if not found

      if (userError && userError.code !== 'PGRST116') {
        console.error('User lookup error:', userError);
        throw userError;
      }

      if (existingUser) {
        // User exists, check if already a member
        const { data: existingMember } = await supabase
          .from('project_members')
          .select('id')
          .eq('project_id', projectId)
          .eq('user_id', existingUser.id)
          .maybeSingle();

        if (existingMember) {
          return { success: false, error: 'User is already a member of this project' };
        }

        // Add them as a member
        const { error: memberError } = await supabase
          .from('project_members')
          .insert({
            project_id: projectId,
            user_id: existingUser.id,
            role: role,
            joined_at: new Date().toISOString(),
          });

        if (memberError) {
          console.error('Member insert error:', memberError);
          throw memberError;
        }

        return { success: true };
      } else {
        // User doesn't exist in public.users
        return { 
          success: false, 
          error: 'User not found. They need to sign up first before you can invite them.' 
        };
      }
    } catch (error) {
      console.error('Failed to invite user:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Get pending invitations for a project
   */
  async getProjectInvitations(projectId: string): Promise<Invitation[]> {
    // TODO: Implement when invitation table is created
    return [];
  }

  /**
   * Cancel an invitation
   */
  async cancelInvitation(invitationId: string): Promise<{ success: boolean; error?: string }> {
    // TODO: Implement when invitation table is created
    return { success: true };
  }

  /**
   * Accept an invitation
   */
  async acceptInvitation(invitationId: string): Promise<{ success: boolean; error?: string }> {
    // TODO: Implement when invitation table is created
    return { success: true };
  }

  /**
   * Decline an invitation
   */
  async declineInvitation(invitationId: string): Promise<{ success: boolean; error?: string }> {
    // TODO: Implement when invitation table is created
    return { success: true };
  }
}

export const invitationService = new InvitationService();
