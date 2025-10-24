// =====================================================
// USE PROJECT PERMISSIONS HOOK
// =====================================================
// Custom hook to check user permissions in a project

import { useMemo } from 'react';
import { useProjectStore } from '../store/projectStore';
import { useUser } from '../contexts/UserContext';
import type { ProjectRole } from '../types/collaboration.types';

export interface ProjectPermissions {
  // View permissions
  canView: boolean;
  
  // Edit permissions
  canEdit: boolean;
  canCreateDiagram: boolean;
  canEditDiagram: boolean;
  canDeleteDiagram: boolean;
  
  // Folder permissions
  canCreateFolder: boolean;
  canEditFolder: boolean;
  canDeleteFolder: boolean;
  canReorderFolders: boolean;
  
  // Project permissions
  canEditProject: boolean;
  canDeleteProject: boolean;
  canManageMembers: boolean;
  canInviteMembers: boolean;
  
  // User info
  userRole: ProjectRole | null;
  isOwner: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  isViewer: boolean;
}

export function useProjectPermissions(): ProjectPermissions {
  const { currentProject, members } = useProjectStore();
  const { user } = useUser();
  const currentUserId = user?.id || null;

  const permissions = useMemo<ProjectPermissions>(() => {
    // No project or user - no permissions
    if (!currentProject || !currentUserId) {
      return {
        canView: false,
        canEdit: false,
        canCreateDiagram: false,
        canEditDiagram: false,
        canDeleteDiagram: false,
        canCreateFolder: false,
        canEditFolder: false,
        canDeleteFolder: false,
        canReorderFolders: false,
        canEditProject: false,
        canDeleteProject: false,
        canManageMembers: false,
        canInviteMembers: false,
        userRole: null,
        isOwner: false,
        isAdmin: false,
        isEditor: false,
        isViewer: false,
      };
    }

    // Check if user is owner
    const isOwner = currentProject.owner_id === currentUserId;

    // Get user's role from members
    const member = members.find(m => m.user_id === currentUserId);
    const userRole = isOwner ? 'owner' : (member?.role || null);

    // Role flags
    const isAdmin = userRole === 'admin';
    const isEditor = userRole === 'editor';
    const isViewer = userRole === 'viewer';

    // Permission matrix
    return {
      // View permissions - all roles can view
      canView: true,

      // Edit permissions - owner, admin, editor
      canEdit: isOwner || isAdmin || isEditor,
      canCreateDiagram: isOwner || isAdmin || isEditor,
      canEditDiagram: isOwner || isAdmin || isEditor,
      canDeleteDiagram: isOwner || isAdmin || isEditor,

      // Folder permissions - owner, admin, editor
      canCreateFolder: isOwner || isAdmin || isEditor,
      canEditFolder: isOwner || isAdmin || isEditor,
      canDeleteFolder: isOwner || isAdmin || isEditor,
      canReorderFolders: isOwner || isAdmin || isEditor,

      // Project permissions - owner only
      canEditProject: isOwner,
      canDeleteProject: isOwner,
      canManageMembers: isOwner,
      canInviteMembers: isOwner,

      // User info
      userRole,
      isOwner,
      isAdmin,
      isEditor,
      isViewer,
    };
  }, [currentProject, currentUserId, members]);

  return permissions;
}
