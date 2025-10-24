// =====================================================
// COMMENT STORE
// =====================================================
// Zustand store for managing diagram comments

import { create } from 'zustand';
import { commentService } from '../services/comment.service';
import type { Comment, CommentThread } from '../types/collaboration.types';

interface CommentState {
  // State
  comments: CommentThread[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchComments: (diagramId: string) => Promise<void>;
  createComment: (data: { diagram_id: string; content: string; parent_id?: string }) => Promise<Comment>;
  updateComment: (commentId: string, data: { content?: string; resolved?: boolean }) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  resolveComment: (commentId: string) => Promise<void>;
  unresolveComment: (commentId: string) => Promise<void>;
  clearComments: () => void;
  clearError: () => void;
}

export const useCommentStore = create<CommentState>((set, get) => ({
  // Initial state
  comments: [],
  loading: false,
  error: null,

  // Fetch comments for a diagram
  fetchComments: async (diagramId) => {
    set({ loading: true, error: null });
    try {
      const comments = await commentService.fetchComments(diagramId);
      set({ comments, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  // Create a new comment
  createComment: async (data) => {
    set({ loading: true, error: null });
    try {
      const comment = await commentService.createComment(data);

      // If it's a reply, add to parent's replies
      if (data.parent_id) {
        set((state) => ({
          comments: state.comments.map((c) =>
            c.id === data.parent_id
              ? { ...c, replies: [...(c.replies || []), comment] }
              : c
          ),
          loading: false,
        }));
      } else {
        // It's a top-level comment
        set((state) => ({
          comments: [...state.comments, { ...comment, replies: [] }],
          loading: false,
        }));
      }

      return comment;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  // Update a comment
  updateComment: async (commentId, data) => {
    set({ loading: true, error: null });
    try {
      const updated = await commentService.updateComment(commentId, data);

      set((state) => ({
        comments: state.comments.map((c) => {
          if (c.id === commentId) {
            return { ...c, ...updated };
          }
          // Check replies
          if (c.replies) {
            return {
              ...c,
              replies: c.replies.map((r) => (r.id === commentId ? updated : r)),
            };
          }
          return c;
        }),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    set({ loading: true, error: null });
    try {
      await commentService.deleteComment(commentId);

      set((state) => ({
        comments: state.comments
          .filter((c) => c.id !== commentId)
          .map((c) => ({
            ...c,
            replies: c.replies?.filter((r) => r.id !== commentId) || [],
          })),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  // Resolve a comment
  resolveComment: async (commentId) => {
    await get().updateComment(commentId, { resolved: true });
  },

  // Unresolve a comment
  unresolveComment: async (commentId) => {
    await get().updateComment(commentId, { resolved: false });
  },

  // Clear comments
  clearComments: () => set({ comments: [] }),

  // Clear error
  clearError: () => set({ error: null }),
}));
