// =====================================================
// COMMENT SERVICE
// =====================================================
// CRUD operations for diagram comments

import { supabase } from './supabase';
import type { Comment, CommentThread } from '../types/collaboration.types';

class CommentService {
  /**
   * Fetch all comments for a diagram
   */
  async fetchComments(diagramId: string): Promise<CommentThread[]> {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:users(id, email, full_name, avatar_url)
      `)
      .eq('diagram_id', diagramId)
      .is('parent_id', null)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Fetch replies for each top-level comment
    const commentsWithReplies = await Promise.all(
      (data || []).map(async (comment) => {
        const replies = await this.fetchReplies(comment.id);
        return { ...comment, replies };
      })
    );

    return commentsWithReplies;
  }

  /**
   * Fetch replies to a comment
   */
  async fetchReplies(parentId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:users(id, email, full_name, avatar_url)
      `)
      .eq('parent_id', parentId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Create a new comment
   */
  async createComment(data: {
    diagram_id: string;
    content: string;
    parent_id?: string;
  }): Promise<Comment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        diagram_id: data.diagram_id,
        user_id: user.id,
        content: data.content,
        parent_id: data.parent_id || null,
      })
      .select(`
        *,
        user:users(id, email, full_name, avatar_url)
      `)
      .single();

    if (error) throw error;
    return comment;
  }

  /**
   * Update a comment
   */
  async updateComment(
    commentId: string,
    data: {
      content?: string;
      resolved?: boolean;
    }
  ): Promise<Comment> {
    const { data: comment, error } = await supabase
      .from('comments')
      .update(data)
      .eq('id', commentId)
      .select(`
        *,
        user:users(id, email, full_name, avatar_url)
      `)
      .single();

    if (error) throw error;
    return comment;
  }

  /**
   * Delete a comment
   */
  async deleteComment(commentId: string): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
  }

  /**
   * Resolve a comment thread
   */
  async resolveComment(commentId: string): Promise<Comment> {
    return this.updateComment(commentId, { resolved: true });
  }

  /**
   * Unresolve a comment thread
   */
  async unresolveComment(commentId: string): Promise<Comment> {
    return this.updateComment(commentId, { resolved: false });
  }
}

export const commentService = new CommentService();
