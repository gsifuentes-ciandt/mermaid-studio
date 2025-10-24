// =====================================================
// DIAGRAM SERVICE
// =====================================================
// Handles diagram CRUD operations with Supabase
// Replaces localStorage for collaboration mode

import { supabase } from './supabase';
import type { Diagram } from '../types/diagram.types';

export interface CloudDiagram {
  id: string;
  folder_id: string;
  created_by: string;
  name: string;
  title: string;
  description: string | null;
  code: string;
  type: string;
  tags: string | null;
  metadata: {
    httpMethod?: string;
    endpointPath?: string;
    requestPayloads?: any;
    responsePayloads?: any;
    workflowActors?: string;
    workflowTrigger?: string;
  } | null;
  created_at: string;
  updated_at: string;
}

/**
 * Creates a new diagram in Supabase
 */
export async function createDiagram(
  diagram: Omit<Diagram, 'createdAt' | 'updatedAt'> & { folder_id: string; created_by: string }
): Promise<{ success: boolean; data?: CloudDiagram; error?: string }> {
  try {
    // Build metadata object from type-specific fields
    const metadata: any = {};
    if (diagram.httpMethod) metadata.httpMethod = diagram.httpMethod;
    if (diagram.endpointPath) metadata.endpointPath = diagram.endpointPath;
    if (diagram.requestPayloads) metadata.requestPayloads = diagram.requestPayloads;
    if (diagram.responsePayloads) metadata.responsePayloads = diagram.responsePayloads;
    if (diagram.workflowActors) metadata.workflowActors = diagram.workflowActors;
    if (diagram.workflowTrigger) metadata.workflowTrigger = diagram.workflowTrigger;

    const { data, error } = await supabase
      .from('diagrams')
      .insert({
        folder_id: diagram.folder_id,
        created_by: diagram.created_by,
        name: diagram.name,
        title: diagram.title,
        description: diagram.description || null,
        code: diagram.code,
        type: diagram.type,
        tags: diagram.tags || null,
        metadata: Object.keys(metadata).length > 0 ? metadata : null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating diagram:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as CloudDiagram };
  } catch (err: any) {
    console.error('Unexpected error creating diagram:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Updates an existing diagram in Supabase
 */
export async function updateDiagram(
  diagramId: string,
  updates: Partial<Omit<Diagram, 'name' | 'createdAt'>>
): Promise<{ success: boolean; data?: CloudDiagram; error?: string }> {
  try {
    // Build metadata object from type-specific fields if any are provided
    const metadata: any = {};
    let hasMetadata = false;
    
    if (updates.httpMethod !== undefined) {
      metadata.httpMethod = updates.httpMethod;
      hasMetadata = true;
    }
    if (updates.endpointPath !== undefined) {
      metadata.endpointPath = updates.endpointPath;
      hasMetadata = true;
    }
    if (updates.requestPayloads !== undefined) {
      metadata.requestPayloads = updates.requestPayloads;
      hasMetadata = true;
    }
    if (updates.responsePayloads !== undefined) {
      metadata.responsePayloads = updates.responsePayloads;
      hasMetadata = true;
    }
    if (updates.workflowActors !== undefined) {
      metadata.workflowActors = updates.workflowActors;
      hasMetadata = true;
    }
    if (updates.workflowTrigger !== undefined) {
      metadata.workflowTrigger = updates.workflowTrigger;
      hasMetadata = true;
    }

    const updateData: any = {
      ...(updates.title && { title: updates.title }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.code && { code: updates.code }),
      ...(updates.type && { type: updates.type }),
      ...(updates.tags !== undefined && { tags: updates.tags }),
      ...(hasMetadata && { metadata }),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('diagrams')
      .update(updateData)
      .eq('id', diagramId)
      .select()
      .single();

    if (error) {
      console.error('Error updating diagram:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as CloudDiagram };
  } catch (err: any) {
    console.error('Unexpected error updating diagram:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Deletes a diagram from Supabase
 */
export async function deleteDiagram(
  diagramId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('diagrams')
      .delete()
      .eq('id', diagramId);

    if (error) {
      console.error('Error deleting diagram:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Unexpected error deleting diagram:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetches all diagrams for a specific folder
 */
export async function fetchDiagramsByFolder(
  folderId: string
): Promise<{ success: boolean; data?: CloudDiagram[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('diagrams')
      .select('*')
      .eq('folder_id', folderId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching diagrams:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as CloudDiagram[] };
  } catch (err: any) {
    console.error('Unexpected error fetching diagrams:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Converts CloudDiagram to local Diagram format
 */
export function cloudDiagramToLocal(cloudDiagram: CloudDiagram): Diagram {
  const metadata = cloudDiagram.metadata || {};
  
  return {
    name: cloudDiagram.id, // Use ID as name for cloud diagrams
    title: cloudDiagram.title,
    description: cloudDiagram.description || undefined,
    code: cloudDiagram.code,
    type: cloudDiagram.type as any,
    tags: cloudDiagram.tags || undefined,
    httpMethod: metadata.httpMethod || undefined,
    endpointPath: metadata.endpointPath || undefined,
    requestPayloads: metadata.requestPayloads || undefined,
    responsePayloads: metadata.responsePayloads || undefined,
    workflowActors: metadata.workflowActors || undefined,
    workflowTrigger: metadata.workflowTrigger || undefined,
    createdAt: cloudDiagram.created_at,
    updatedAt: cloudDiagram.updated_at,
  };
}
