// =====================================================
// PROJECT STORE
// =====================================================
// Zustand store for managing projects and folders

import { create } from 'zustand';
import { projectService } from '../services/project.service';
import { folderService } from '../services/folder.service';
import { isDemoMode, mockProjects, mockFolders, mockMembers } from '../services/demo.service';
import type { Project, Folder, ProjectMember, ProjectRole } from '../types/collaboration.types';

interface ProjectState {
  // State
  projects: Project[];
  currentProject: Project | null;
  folders: Folder[];
  currentFolder: Folder | null;
  members: ProjectMember[];
  loading: boolean;
  error: string | null;

  // Project actions
  fetchProjects: () => Promise<void>;
  fetchProject: (projectId: string) => Promise<void>;
  createProject: (data: { name: string; description?: string; visibility?: 'private' | 'team' }) => Promise<Project>;
  updateProject: (projectId: string, data: { name?: string; description?: string; visibility?: 'private' | 'team' }) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;

  // Folder actions
  fetchFolders: (projectId: string) => Promise<void>;
  createFolder: (data: { project_id: string; name: string; description?: string; parent_folder_id?: string }) => Promise<Folder>;
  updateFolder: (folderId: string, data: { name?: string; description?: string }) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  setCurrentFolder: (folder: Folder | null) => void;

  // Member actions
  fetchMembers: (projectId: string) => Promise<void>;
  addMember: (projectId: string, userId: string, role: ProjectRole) => Promise<void>;
  updateMemberRole: (memberId: string, role: ProjectRole) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;

  // Utility
  clearError: () => void;
  reset: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  // Initial state
  projects: [],
  currentProject: null,
  folders: [],
  currentFolder: null,
  members: [],
  loading: false,
  error: null,

  // Project actions
  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      // Demo mode: Use mock data
      if (isDemoMode()) {
        set({ projects: mockProjects, loading: false });
        return;
      }
      
      const projects = await projectService.fetchProjects();
      set({ projects, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  fetchProject: async (projectId: string) => {
    set({ loading: true, error: null, currentFolder: null });
    try {
      // Demo mode: Use mock data
      if (isDemoMode()) {
        const project = mockProjects.find(p => p.id === projectId) || null;
        set({ currentProject: project, loading: false });
        return;
      }
      
      const project = await projectService.fetchProject(projectId);
      set({ currentProject: project, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  createProject: async (data) => {
    set({ loading: true, error: null });
    try {
      const project = await projectService.createProject(data);
      set((state) => ({
        projects: [project, ...state.projects],
        loading: false,
      }));
      return project;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateProject: async (projectId, data) => {
    set({ loading: true, error: null });
    try {
      const updated = await projectService.updateProject(projectId, data);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === projectId ? updated : p)),
        currentProject: state.currentProject?.id === projectId ? updated : state.currentProject,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteProject: async (projectId) => {
    set({ loading: true, error: null });
    try {
      await projectService.deleteProject(projectId);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== projectId),
        currentProject: state.currentProject?.id === projectId ? null : state.currentProject,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  setCurrentProject: (project) => set({ currentProject: project }),

  // Folder actions
  fetchFolders: async (projectId) => {
    set({ loading: true, error: null });
    try {
      // Demo mode: Use mock data
      if (isDemoMode()) {
        const folders = mockFolders[projectId] || [];
        set({ folders, loading: false });
        return;
      }
      
      const folders = await folderService.fetchFolders(projectId);
      set({ folders, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  createFolder: async (data) => {
    set({ loading: true, error: null });
    try {
      const folder = await folderService.createFolder(data);
      set((state) => ({
        folders: [...state.folders, folder],
        loading: false,
      }));
      return folder;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateFolder: async (folderId, data) => {
    set({ loading: true, error: null });
    try {
      const updated = await folderService.updateFolder(folderId, data);
      set((state) => ({
        folders: state.folders.map((f) => 
          f.id === folderId 
            ? { 
                ...f, // Keep all existing properties including isExpanded
                ...updated, // Apply updates from server
                isExpanded: f.isExpanded // Explicitly preserve isExpanded
              }
            : f // Keep other folders unchanged
        ),
        currentFolder: state.currentFolder?.id === folderId 
          ? { 
              ...state.currentFolder,
              ...updated,
              isExpanded: state.currentFolder.isExpanded 
            }
          : state.currentFolder,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteFolder: async (folderId) => {
    set({ loading: true, error: null });
    try {
      await folderService.deleteFolder(folderId);
      set((state) => ({
        folders: state.folders.filter((f) => f.id !== folderId),
        currentFolder: state.currentFolder?.id === folderId ? null : state.currentFolder,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  setCurrentFolder: (folder) => set({ currentFolder: folder }),

  // Member actions
  fetchMembers: async (projectId) => {
    set({ loading: true, error: null });
    try {
      // Demo mode: Use mock data
      if (isDemoMode()) {
        const members = mockMembers.filter(m => m.project_id === projectId);
        set({ members, loading: false });
        return;
      }
      
      const members = await projectService.fetchProjectMembers(projectId);
      set({ members, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  addMember: async (projectId, userId, role) => {
    set({ loading: true, error: null });
    try {
      const member = await projectService.addProjectMember(projectId, userId, role);
      set((state) => ({
        members: [...state.members, member],
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateMemberRole: async (memberId, role) => {
    set({ loading: true, error: null });
    try {
      const updated = await projectService.updateMemberRole(memberId, role);
      set((state) => ({
        members: state.members.map((m) => (m.id === memberId ? updated : m)),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  removeMember: async (memberId) => {
    set({ loading: true, error: null });
    try {
      await projectService.removeMember(memberId);
      set((state) => ({
        members: state.members.filter((m) => m.id !== memberId),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  // Utility
  clearError: () => set({ error: null }),
  reset: () => set({
    projects: [],
    currentProject: null,
    folders: [],
    currentFolder: null,
    members: [],
    loading: false,
    error: null,
  }),
}));
