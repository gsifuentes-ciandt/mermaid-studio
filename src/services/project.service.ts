// =====================================================
// PROJECT SERVICE
// =====================================================
// CRUD operations for projects

import { supabase } from './supabase';
import type { Project, ProjectMember, ProjectRole } from '../types/collaboration.types';

class ProjectService {
  /**
   * Fetch all projects accessible to the current user
   */
  async fetchProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        owner:users!owner_id(id, email, full_name, avatar_url),
        member_count:project_members(count),
        folder_count:folders(count)
      `)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    
    // For each project, get the diagram count by querying through folders
    const projectsWithCounts = await Promise.all((data || []).map(async (project) => {
      // Get diagram count for this project
      const { count: diagramCount } = await supabase
        .from('diagrams')
        .select('*', { count: 'exact', head: true })
        .in('folder_id', 
          await supabase
            .from('folders')
            .select('id')
            .eq('project_id', project.id)
            .then(({ data: folders }) => folders?.map(f => f.id) || [])
        );
      
      return {
        ...project,
        member_count: project.member_count?.[0]?.count || 0,
        folder_count: project.folder_count?.[0]?.count || 0,
        diagram_count: diagramCount || 0,
      };
    }));
    
    return projectsWithCounts;
  }

  /**
   * Fetch a single project by ID
   */
  async fetchProject(projectId: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        owner:users!owner_id(id, email, full_name, avatar_url),
        members:project_members(
          *,
          user:users(id, email, full_name, avatar_url)
        )
      `)
      .eq('id', projectId)
      .maybeSingle(); // Use maybeSingle to return null if not found instead of throwing error

    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data;
  }

  /**
   * Create a new project
   */
  async createProject(data: {
    name: string;
    description?: string;
    visibility?: 'private' | 'team';
  }): Promise<Project> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        owner_id: user.id,
        name: data.name,
        description: data.description || null,
        visibility: data.visibility || 'private',
      })
      .select()
      .single();

    if (error) throw error;
    return project;
  }

  /**
   * Update a project
   */
  async updateProject(
    projectId: string,
    data: {
      name?: string;
      description?: string;
      visibility?: 'private' | 'team';
    }
  ): Promise<Project> {
    const { data: project, error } = await supabase
      .from('projects')
      .update(data)
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return project;
  }

  /**
   * Delete a project
   */
  async deleteProject(projectId: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;
  }

  /**
   * Fetch project members
   */
  async fetchProjectMembers(projectId: string): Promise<ProjectMember[]> {
    const { data, error } = await supabase
      .from('project_members')
      .select(`
        *,
        user:users(id, email, full_name, avatar_url)
      `)
      .eq('project_id', projectId)
      .order('role', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Add a member to a project
   */
  async addProjectMember(
    projectId: string,
    userId: string,
    role: ProjectRole
  ): Promise<ProjectMember> {
    const { data, error } = await supabase
      .from('project_members')
      .insert({
        project_id: projectId,
        user_id: userId,
        role,
        joined_at: new Date().toISOString(),
      })
      .select(`
        *,
        user:users(id, email, full_name, avatar_url)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update a member's role
   */
  async updateMemberRole(
    memberId: string,
    role: ProjectRole
  ): Promise<ProjectMember> {
    const { data, error } = await supabase
      .from('project_members')
      .update({ role })
      .eq('id', memberId)
      .select(`
        *,
        user:users(id, email, full_name, avatar_url)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Remove a member from a project
   */
  async removeMember(memberId: string): Promise<void> {
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('id', memberId);

    if (error) throw error;
  }

  /**
   * Get user's role in a project
   */
  async getUserRole(projectId: string): Promise<ProjectRole | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Check if user is owner
    const { data: project } = await supabase
      .from('projects')
      .select('owner_id')
      .eq('id', projectId)
      .single();

    if (project?.owner_id === user.id) return 'owner';

    // Check project_members
    const { data: member } = await supabase
      .from('project_members')
      .select('role')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .single();

    return member?.role || null;
  }
}

export const projectService = new ProjectService();
