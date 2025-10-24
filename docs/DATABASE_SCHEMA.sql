-- =====================================================
-- MERMAID STUDIO PRO - DATABASE SCHEMA
-- =====================================================
-- Version: 1.0.1
-- Date: 2025-10-23
-- Database: PostgreSQL 15+ (Supabase)
-- Purpose: Multi-user collaboration with projects, folders, and permissions
-- 
-- CHANGELOG:
-- v1.0.1 (2025-10-23):
--   - Fixed trigger timing: Changed from AFTER to BEFORE for DELETE operations
--   - Fixed trigger function: Added RETURN OLD for DELETE operations
--   - Updated activity_logs.diagram_id: Changed from SET NULL to CASCADE
--   - These changes prevent foreign key violations when deleting diagrams
-- 
-- v1.0.0 (2025-10-21):
--   - Initial schema release
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- PUBLIC USERS TABLE
-- =====================================================
-- Extends Supabase auth.users with additional profile data
-- Automatically populated via trigger on auth.users insert

CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_sign_in TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.users IS 'User profiles extending Supabase auth.users';
COMMENT ON COLUMN public.users.id IS 'References auth.users.id';
COMMENT ON COLUMN public.users.email IS 'User email from OAuth provider';
COMMENT ON COLUMN public.users.full_name IS 'Display name from OAuth provider';
COMMENT ON COLUMN public.users.avatar_url IS 'Profile picture URL from OAuth provider';

-- =====================================================
-- USER PREFERENCES
-- =====================================================
-- Stores user-specific settings and AI credentials

CREATE TABLE public.user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- AI Configuration
    ai_provider TEXT DEFAULT 'flow' CHECK (ai_provider IN ('flow', 'openai', 'claude')),
    ai_credentials JSONB DEFAULT '{}'::jsonb,
    
    -- UI Preferences
    theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
    language TEXT DEFAULT 'en' CHECK (language IN ('en', 'es', 'pt')),
    
    -- Timestamps
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

COMMENT ON TABLE public.user_preferences IS 'User-specific settings and AI credentials';
COMMENT ON COLUMN public.user_preferences.ai_credentials IS 'Encrypted JSON containing API keys, tenant, agent, etc.';

-- =====================================================
-- PROJECTS
-- =====================================================
-- Top-level containers for organizing diagrams

CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
    description TEXT CHECK (char_length(description) <= 500),
    visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'team')),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_projects_owner ON public.projects(owner_id);
CREATE INDEX idx_projects_visibility ON public.projects(visibility);
CREATE INDEX idx_projects_sort_order ON public.projects(owner_id, sort_order);

COMMENT ON TABLE public.projects IS 'Top-level containers for organizing diagrams';
COMMENT ON COLUMN public.projects.visibility IS 'private: only members can access, team: discoverable by team';
COMMENT ON COLUMN public.projects.sort_order IS 'Display order in sidebar for user (lower = first)';

-- =====================================================
-- PROJECT MEMBERS (Permissions)
-- =====================================================
-- Defines who has access to a project and their role

CREATE TABLE public.project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    joined_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(project_id, user_id)
);

CREATE INDEX idx_project_members_user ON public.project_members(user_id);
CREATE INDEX idx_project_members_project ON public.project_members(project_id);
CREATE INDEX idx_project_members_role ON public.project_members(role);

COMMENT ON TABLE public.project_members IS 'Project permissions and team members';
COMMENT ON COLUMN public.project_members.role IS 'owner: full control, admin: manage members, editor: edit content, viewer: read-only';
COMMENT ON COLUMN public.project_members.joined_at IS 'NULL if invitation not yet accepted';

-- =====================================================
-- FOLDERS
-- =====================================================
-- Organize diagrams within projects (supports nested hierarchy)

CREATE TABLE public.folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    parent_folder_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
    description TEXT CHECK (char_length(description) <= 500),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent circular references
    CONSTRAINT no_self_reference CHECK (id != parent_folder_id)
);

CREATE INDEX idx_folders_project ON public.folders(project_id);
CREATE INDEX idx_folders_parent ON public.folders(parent_folder_id);
CREATE INDEX idx_folders_sort_order ON public.folders(project_id, parent_folder_id, sort_order);

COMMENT ON TABLE public.folders IS 'Organize diagrams within projects (supports nested hierarchy)';
COMMENT ON COLUMN public.folders.parent_folder_id IS 'NULL for root folders, references parent for nested folders';
COMMENT ON COLUMN public.folders.sort_order IS 'Display order within parent (lower = first)';

-- =====================================================
-- DIAGRAMS
-- =====================================================
-- The actual Mermaid diagrams

CREATE TABLE public.diagrams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    folder_id UUID NOT NULL REFERENCES public.folders(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE SET NULL,
    
    -- Core Fields
    name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
    title TEXT NOT NULL CHECK (char_length(title) >= 1 AND char_length(title) <= 200),
    description TEXT,
    code TEXT NOT NULL CHECK (char_length(code) >= 1),
    type TEXT NOT NULL CHECK (type IN ('workflow', 'endpoint', 'architecture', 'sequence', 'state', 'other')),
    tags TEXT,
    
    -- Type-Specific Metadata (stored as JSONB for flexibility)
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_diagrams_folder ON public.diagrams(folder_id);
CREATE INDEX idx_diagrams_created_by ON public.diagrams(created_by);
CREATE INDEX idx_diagrams_type ON public.diagrams(type);
CREATE INDEX idx_diagrams_created_at ON public.diagrams(created_at DESC);

-- Full-text search on title, description, tags
CREATE INDEX idx_diagrams_search ON public.diagrams USING gin(
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(tags, ''))
);

COMMENT ON TABLE public.diagrams IS 'Mermaid diagrams with metadata';
COMMENT ON COLUMN public.diagrams.metadata IS 'Type-specific fields (httpMethod, endpointPath, requestPayloads, responsePayloads, workflowActors, workflowTrigger)';
COMMENT ON COLUMN public.diagrams.name IS 'Unique identifier (slug)';
COMMENT ON COLUMN public.diagrams.title IS 'Display title';

-- =====================================================
-- COMMENTS
-- =====================================================
-- Collaboration through diagram comments

CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diagram_id UUID NOT NULL REFERENCES public.diagrams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 2000),
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_comments_diagram ON public.comments(diagram_id);
CREATE INDEX idx_comments_user ON public.comments(user_id);
CREATE INDEX idx_comments_parent ON public.comments(parent_id);
CREATE INDEX idx_comments_resolved ON public.comments(diagram_id, resolved);

COMMENT ON TABLE public.comments IS 'Comments and discussions on diagrams';
COMMENT ON COLUMN public.comments.parent_id IS 'NULL for top-level comments, references parent for replies';
COMMENT ON COLUMN public.comments.resolved IS 'Mark comment thread as resolved';

-- =====================================================
-- ACTIVITY LOGS
-- =====================================================
-- Track all actions for audit and activity feed

CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    diagram_id UUID REFERENCES public.diagrams(id) ON DELETE CASCADE,  -- Changed from SET NULL to CASCADE
    action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'deleted', 'commented', 'shared', 'invited')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_project ON public.activity_logs(project_id, created_at DESC);
CREATE INDEX idx_activity_logs_user ON public.activity_logs(user_id, created_at DESC);
CREATE INDEX idx_activity_logs_diagram ON public.activity_logs(diagram_id, created_at DESC);
CREATE INDEX idx_activity_logs_action ON public.activity_logs(action);

COMMENT ON TABLE public.activity_logs IS 'Audit trail and activity feed';
COMMENT ON COLUMN public.activity_logs.metadata IS 'Additional context (e.g., old values, change details)';

-- =====================================================
-- ERROR LOGS (For AI and Mermaid Errors)
-- =====================================================
-- Track errors for analysis and improvement

CREATE TABLE public.error_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    session_id TEXT,
    
    -- Error Classification
    error_type TEXT NOT NULL CHECK (error_type IN ('ai_generation', 'ai_modification', 'ai_explanation', 'mermaid_render', 'api_error')),
    error_message TEXT NOT NULL,
    error_stack TEXT,
    
    -- AI Context
    user_prompt TEXT,
    ai_response TEXT,
    request_payload JSONB,
    response_payload JSONB,
    
    -- Diagram Context
    diagram_code TEXT,
    diagram_type TEXT,
    sanitized_code TEXT,
    
    -- Additional Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_error_logs_user ON public.error_logs(user_id, created_at DESC);
CREATE INDEX idx_error_logs_type ON public.error_logs(error_type, created_at DESC);
CREATE INDEX idx_error_logs_created ON public.error_logs(created_at DESC);
CREATE INDEX idx_error_logs_session ON public.error_logs(session_id);

COMMENT ON TABLE public.error_logs IS 'Track AI and Mermaid rendering errors for analysis and improvement';
COMMENT ON COLUMN public.error_logs.error_type IS 'Type of error: ai_generation, ai_modification, ai_explanation, mermaid_render, api_error';
COMMENT ON COLUMN public.error_logs.user_prompt IS 'User prompt that caused the error (for AI errors)';
COMMENT ON COLUMN public.error_logs.diagram_code IS 'Diagram code that failed to render (for Mermaid errors)';
COMMENT ON COLUMN public.error_logs.metadata IS 'Additional context: provider, model, latency, code length, etc.';

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
-- Automatic permission enforcement at database level

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagrams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USERS POLICIES
-- =====================================================

CREATE POLICY "Users can view all users"
    ON public.users FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- =====================================================
-- USER PREFERENCES POLICIES
-- =====================================================

CREATE POLICY "Users can view own preferences"
    ON public.user_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
    ON public.user_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
    ON public.user_preferences FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
    ON public.user_preferences FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- PROJECTS POLICIES
-- =====================================================
-- Updated policies to fix RLS issues with project creation

-- 1. INSERT: Allow authenticated users to create projects where they are the owner
CREATE POLICY "Users can create projects"
    ON public.projects FOR INSERT
    TO authenticated
    WITH CHECK (owner_id = auth.uid());

-- 2. SELECT: Users can view projects they have access to
CREATE POLICY "Users can view accessible projects"
    ON public.projects FOR SELECT
    TO authenticated
    USING (
        owner_id = auth.uid() 
        OR EXISTS (
            SELECT 1 FROM public.project_members
            WHERE project_id = projects.id
            AND user_id = auth.uid()
        )
    );

-- 3. UPDATE: Only owners can update projects
CREATE POLICY "Owners can update their projects"
    ON public.projects FOR UPDATE
    TO authenticated
    USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid());

-- 4. DELETE: Only owners can delete projects
CREATE POLICY "Owners can delete their projects"
    ON public.projects FOR DELETE
    TO authenticated
    USING (owner_id = auth.uid());

-- =====================================================
-- PROJECT MEMBERS POLICIES
-- =====================================================
-- Uses security definer function to check access without recursion

CREATE POLICY "Users can view project members"
    ON public.project_members FOR SELECT
    USING (user_has_project_access(project_id, auth.uid()));

CREATE POLICY "Owners can add members"
    ON public.project_members FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = project_members.project_id 
            AND p.owner_id = auth.uid()
        )
    );

CREATE POLICY "Owners can update member roles"
    ON public.project_members FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = project_members.project_id 
            AND p.owner_id = auth.uid()
        )
    );

CREATE POLICY "Owners can remove members"
    ON public.project_members FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = project_members.project_id 
            AND p.owner_id = auth.uid()
        )
    );

-- =====================================================
-- FOLDERS POLICIES
-- =====================================================
-- Uses security definer function for access control

CREATE POLICY "Users can view accessible folders"
    ON public.folders FOR SELECT
    USING (user_has_project_access(project_id, auth.uid()));

CREATE POLICY "Owners can create folders"
    ON public.folders FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = folders.project_id 
            AND p.owner_id = auth.uid()
        )
    );

CREATE POLICY "Owners can update folders"
    ON public.folders FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = folders.project_id 
            AND p.owner_id = auth.uid()
        )
    );

CREATE POLICY "Owners can delete folders"
    ON public.folders FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = folders.project_id 
            AND p.owner_id = auth.uid()
        )
    );

-- =====================================================
-- DIAGRAMS POLICIES
-- =====================================================
-- Uses security definer function for access control

CREATE POLICY "Users can view accessible diagrams"
    ON public.diagrams FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.folders f
            WHERE f.id = diagrams.folder_id
            AND user_has_project_access(f.project_id, auth.uid())
        )
    );

CREATE POLICY "Owners can create diagrams"
    ON public.diagrams FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.folders f
            JOIN public.projects p ON p.id = f.project_id
            WHERE f.id = diagrams.folder_id 
            AND p.owner_id = auth.uid()
        )
    );

CREATE POLICY "Owners can update diagrams"
    ON public.diagrams FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.folders f
            JOIN public.projects p ON p.id = f.project_id
            WHERE f.id = diagrams.folder_id 
            AND p.owner_id = auth.uid()
        )
    );

CREATE POLICY "Owners can delete diagrams"
    ON public.diagrams FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.folders f
            JOIN public.projects p ON p.id = f.project_id
            WHERE f.id = diagrams.folder_id 
            AND p.owner_id = auth.uid()
        )
    );

-- =====================================================
-- COMMENTS POLICIES
-- =====================================================
-- Simplified to avoid recursion

CREATE POLICY "Owners can view comments on their diagrams"
    ON public.comments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.diagrams d
            JOIN public.folders f ON f.id = d.folder_id
            JOIN public.projects p ON p.id = f.project_id
            WHERE d.id = comments.diagram_id 
            AND p.owner_id = auth.uid()
        )
    );

CREATE POLICY "Owners can create comments on their diagrams"
    ON public.comments FOR INSERT
    WITH CHECK (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.diagrams d
            JOIN public.folders f ON f.id = d.folder_id
            JOIN public.projects p ON p.id = f.project_id
            WHERE d.id = comments.diagram_id
            AND p.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own comments"
    ON public.comments FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own comments"
    ON public.comments FOR DELETE
    USING (user_id = auth.uid());

-- =====================================================
-- ACTIVITY LOGS POLICIES
-- =====================================================
-- Simplified to avoid recursion

CREATE POLICY "Owners can view activity logs for their projects"
    ON public.activity_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = activity_logs.project_id 
            AND p.owner_id = auth.uid()
        )
    );

-- =====================================================
-- ERROR LOGS POLICIES
-- =====================================================

CREATE POLICY "Users can view own error logs"
    ON public.error_logs FOR SELECT
    USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can create error logs"
    ON public.error_logs FOR INSERT
    WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Note: Only admins should be able to view all error logs
-- This can be implemented with a custom function or service role

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_folders_updated_at
    BEFORE UPDATE ON public.folders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diagrams_updated_at
    BEFORE UPDATE ON public.diagrams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to automatically add owner as member when creating project
CREATE OR REPLACE FUNCTION add_owner_as_member()
RETURNS TRIGGER AS $$
BEGIN
    -- Automatically add owner as 'owner' member
    INSERT INTO public.project_members (project_id, user_id, role, joined_at)
    VALUES (NEW.id, NEW.owner_id, 'owner', NOW());
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to add owner as member
CREATE TRIGGER add_owner_as_member_trigger
    AFTER INSERT ON public.projects
    FOR EACH ROW EXECUTE FUNCTION add_owner_as_member();

-- Function to log diagram activity
CREATE OR REPLACE FUNCTION log_diagram_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.activity_logs (project_id, user_id, diagram_id, action, metadata)
        SELECT f.project_id, NEW.created_by, NEW.id, 'created', jsonb_build_object('title', NEW.title)
        FROM public.folders f
        WHERE f.id = NEW.folder_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.activity_logs (project_id, user_id, diagram_id, action, metadata)
        SELECT f.project_id, auth.uid(), NEW.id, 'updated', jsonb_build_object('title', NEW.title)
        FROM public.folders f
        WHERE f.id = NEW.folder_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Log deletion BEFORE the diagram is deleted
        INSERT INTO public.activity_logs (project_id, user_id, diagram_id, action, metadata)
        SELECT f.project_id, auth.uid(), OLD.id, 'deleted', jsonb_build_object('title', OLD.title)
        FROM public.folders f
        WHERE f.id = OLD.folder_id;
        RETURN OLD;  -- CRITICAL: Return OLD for DELETE operations
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers to log diagram activity
-- Split into two triggers: AFTER for INSERT/UPDATE (diagram exists with ID)
-- and BEFORE for DELETE (diagram still exists when logging)

CREATE TRIGGER log_diagram_activity_after_trigger
    AFTER INSERT OR UPDATE ON public.diagrams
    FOR EACH ROW EXECUTE FUNCTION log_diagram_activity();

CREATE TRIGGER log_diagram_activity_before_trigger
    BEFORE DELETE ON public.diagrams
    FOR EACH ROW EXECUTE FUNCTION log_diagram_activity();

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to check project access (bypasses RLS to avoid recursion)
CREATE OR REPLACE FUNCTION user_has_project_access(p_project_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user is owner
  IF EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = p_project_id AND owner_id = p_user_id
  ) THEN
    RETURN TRUE;
  END IF;
  
  -- Check if user is a member (bypasses RLS because of SECURITY DEFINER)
  IF EXISTS (
    SELECT 1 FROM public.project_members 
    WHERE project_id = p_project_id AND user_id = p_user_id
  ) THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has permission on project
CREATE OR REPLACE FUNCTION has_project_permission(
    p_project_id UUID,
    p_user_id UUID,
    p_required_role TEXT DEFAULT 'viewer'
)
RETURNS BOOLEAN AS $$
DECLARE
    v_user_role TEXT;
    v_role_hierarchy TEXT[] := ARRAY['viewer', 'editor', 'admin', 'owner'];
    v_required_level INT;
    v_user_level INT;
BEGIN
    -- Get user's role
    SELECT role INTO v_user_role
    FROM public.project_members
    WHERE project_id = p_project_id AND user_id = p_user_id;
    
    -- Owner always has permission
    IF EXISTS (SELECT 1 FROM public.projects WHERE id = p_project_id AND owner_id = p_user_id) THEN
        RETURN TRUE;
    END IF;
    
    -- Check role hierarchy
    v_required_level := array_position(v_role_hierarchy, p_required_role);
    v_user_level := array_position(v_role_hierarchy, v_user_role);
    
    RETURN v_user_level >= v_required_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SAMPLE DATA (FOR TESTING)
-- =====================================================
-- Uncomment to insert sample data

/*
-- Insert sample user (replace with actual auth.users id)
INSERT INTO public.users (id, email, full_name) VALUES
('00000000-0000-0000-0000-000000000001', 'john@example.com', 'John Doe');

-- Insert sample project
INSERT INTO public.projects (id, owner_id, name, description) VALUES
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Sample Project', 'A sample project for testing');

-- Insert sample folder
INSERT INTO public.folders (id, project_id, name) VALUES
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Sample Folder');

-- Insert sample diagram
INSERT INTO public.diagrams (folder_id, created_by, name, title, description, code, type) VALUES
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'sample-diagram', 'Sample Diagram', 'A sample diagram', 'graph TD\n  A-->B', 'workflow');
*/

-- =====================================================
-- END OF SCHEMA
-- =====================================================
