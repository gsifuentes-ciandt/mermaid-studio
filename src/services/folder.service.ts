// =====================================================
// FOLDER SERVICE
// =====================================================
// CRUD operations for folders within projects

import { supabase } from './supabase';
import type { Folder } from '../types/collaboration.types';

class FolderService {
  /**
   * Fetch all folders in a project with diagram counts
   */
  async fetchFolders(projectId: string): Promise<Folder[]> {
    const { data, error } = await supabase
      .from('folders')
      .select(`
        *,
        diagrams:diagrams(count)
      `)
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    
    // Transform the data to include diagram_count
    const folders = (data || []).map((folder: any) => ({
      ...folder,
      diagram_count: folder.diagrams?.[0]?.count || 0,
      diagrams: undefined, // Remove the diagrams array
    }));
    
    return folders;
  }

  /**
   * Fetch a single folder by ID
   */
  async fetchFolder(folderId: string): Promise<Folder | null> {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('id', folderId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Create a new folder
   */
  async createFolder(data: {
    project_id: string;
    name: string;
    description?: string;
    parent_folder_id?: string;
    sort_order?: number;
  }): Promise<Folder> {
    const { data: folder, error } = await supabase
      .from('folders')
      .insert({
        project_id: data.project_id,
        name: data.name,
        description: data.description || null,
        parent_folder_id: data.parent_folder_id || null,
        sort_order: data.sort_order || 0,
      })
      .select()
      .single();

    if (error) throw error;
    return folder;
  }

  /**
   * Update a folder
   */
  async updateFolder(
    folderId: string,
    data: {
      name?: string;
      description?: string;
      sort_order?: number;
    }
  ): Promise<Folder> {
    const { data: folder, error } = await supabase
      .from('folders')
      .update(data)
      .eq('id', folderId)
      .select()
      .single();

    if (error) throw error;
    return folder;
  }

  /**
   * Delete a folder
   */
  async deleteFolder(folderId: string): Promise<void> {
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', folderId);

    if (error) throw error;
  }

  /**
   * Reorder folders
   */
  async reorderFolders(updates: { id: string; sort_order: number }[]): Promise<void> {
    const promises = updates.map(({ id, sort_order }) =>
      supabase
        .from('folders')
        .update({ sort_order })
        .eq('id', id)
    );

    await Promise.all(promises);
  }
}

export const folderService = new FolderService();
