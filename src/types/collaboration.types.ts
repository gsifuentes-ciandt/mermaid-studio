// =====================================================
// COLLABORATION TYPES
// =====================================================
// TypeScript types for multi-user collaboration features

import type { Diagram } from './diagram.types';

// Re-export Diagram type for convenience
export type { Diagram };

// =====================================================
// USER TYPES
// =====================================================

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  last_sign_in: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  ai_provider: 'flow' | 'openai' | 'claude';
  ai_credentials: AICredentials;
  theme: 'light' | 'dark';
  language: 'en' | 'es' | 'pt';
  updated_at: string;
}

export interface AICredentials {
  // Flow API
  flow_api_url?: string;
  flow_client_id?: string;
  flow_client_secret?: string;
  flow_tenant?: string;
  flow_agent?: string;
  
  // OpenAI
  openai_api_key?: string;
  openai_api_url?: string;
  
  // Claude
  claude_api_key?: string;
}

// =====================================================
// PROJECT TYPES
// =====================================================

export interface Project {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  visibility: 'private' | 'team';
  sort_order: number;
  created_at: string;
  updated_at: string;
  
  // Computed/joined fields
  owner?: User;
  member_count?: number;
  diagram_count?: number;
  folder_count?: number;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  invited_at: string;
  joined_at: string | null;
  
  // Joined fields
  user?: User;
}

export type ProjectRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface ProjectWithMembers extends Project {
  members: ProjectMember[];
}

// =====================================================
// FOLDER TYPES
// =====================================================

export interface Folder {
  id: string;
  project_id: string;
  parent_folder_id: string | null;
  name: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  
  // Computed fields
  diagram_count?: number;
  children?: Folder[];
  isExpanded?: boolean;
}

// =====================================================
// DIAGRAM TYPES (Cloud-based)
// =====================================================

export type DiagramType = 'workflow' | 'endpoint' | 'architecture' | 'sequence' | 'state' | 'other';

export interface CloudDiagram {
  id: string;
  folder_id: string;
  title: string;
  description: string | null;
  code: string;
  type: DiagramType;
  created_at: string;
  updated_at: string;
  created_by: string;
  
  // Endpoint-specific fields
  http_method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint_path?: string;
  
  // Workflow-specific fields
  workflow_actors?: string;
  workflow_trigger?: string;
  
  // Joined fields
  creator?: User;
  comment_count?: number;
}

export interface FolderWithDiagrams extends Folder {
  diagrams: Diagram[];
}

// =====================================================
// COMMENT TYPES
// =====================================================

export interface Comment {
  id: string;
  diagram_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  resolved: boolean;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  user?: User;
  replies?: Comment[];
}

export interface CommentThread extends Comment {
  replies: Comment[];
}

// =====================================================
// ACTIVITY LOG TYPES
// =====================================================

export type ActivityAction = 'created' | 'updated' | 'deleted' | 'commented' | 'shared' | 'invited';

export interface ActivityLog {
  id: string;
  project_id: string;
  user_id: string | null;
  diagram_id: string | null;
  action: ActivityAction;
  metadata: Record<string, any>;
  created_at: string;
  
  // Joined fields
  user?: User;
  diagram?: Diagram;
}

// =====================================================
// ERROR LOG TYPES
// =====================================================

export type ErrorType = 'ai_generation' | 'ai_modification' | 'ai_explanation' | 'mermaid_render' | 'api_error';

export interface ErrorLog {
  id: string;
  user_id: string | null;
  session_id: string | null;
  error_type: ErrorType;
  error_message: string;
  error_stack: string | null;
  user_prompt: string | null;
  ai_response: string | null;
  request_payload: Record<string, any> | null;
  response_payload: Record<string, any> | null;
  diagram_code: string | null;
  diagram_type: string | null;
  sanitized_code: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

// =====================================================
// ANALYTICS TYPES
// =====================================================

export interface AnalyticsEvent {
  id: string;
  user_id: string | null;
  event_type: 'user_action' | 'ai_interaction' | 'collaboration' | 'export' | 'session';
  event_name: string;
  properties: Record<string, any>;
  session_id: string | null;
  created_at: string;
}

export interface DiagramView {
  id: string;
  diagram_id: string;
  user_id: string | null;
  viewed_at: string;
  session_id: string | null;
}

export interface AIInteraction {
  id: string;
  user_id: string;
  interaction_type: 'generate' | 'modify' | 'explain' | 'question';
  prompt: string;
  response: string | null;
  accepted: boolean | null;
  error: string | null;
  response_time_ms: number;
  tokens_used: number | null;
  cost_usd: number | null;
  created_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  actions_count: number;
  pages_viewed: number;
}

// =====================================================
// METRICS TYPES
// =====================================================

export interface ProjectStats {
  project_id: string;
  project_name: string;
  folder_count: number;
  diagram_count: number;
  comment_count: number;
  member_count: number;
  last_activity: string | null;
}

export interface UserStats {
  user_id: string;
  full_name: string | null;
  diagrams_created: number;
  comments_posted: number;
  projects_member_of: number;
  projects_owned: number;
  last_active: string | null;
}

export interface ErrorStats {
  total: number;
  byType: Record<ErrorType, number>;
  last24Hours: number;
  last7Days: number;
  last30Days: number;
}

// =====================================================
// INVITATION TYPES
// =====================================================

export interface Invitation {
  id: string;
  project_id: string;
  email: string;
  role: ProjectRole;
  invited_by: string;
  invited_at: string;
  expires_at: string;
  accepted_at: string | null;
  
  // Joined fields
  project?: Project;
  inviter?: User;
}

// =====================================================
// PERMISSION HELPERS
// =====================================================

export const ROLE_HIERARCHY: Record<ProjectRole, number> = {
  viewer: 1,
  editor: 2,
  admin: 3,
  owner: 4,
};

export function hasPermission(userRole: ProjectRole, requiredRole: ProjectRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canEdit(role: ProjectRole): boolean {
  return hasPermission(role, 'editor');
}

export function canManageMembers(role: ProjectRole): boolean {
  return hasPermission(role, 'admin');
}

export function isOwner(role: ProjectRole): boolean {
  return role === 'owner';
}
