// =====================================================
// DEMO SERVICE
// =====================================================
// Mock data and services for testing collaboration features without Supabase

import type { User } from '@supabase/supabase-js';
import type { Project, Folder, ProjectMember, CloudDiagram } from '../types/collaboration.types';

// Mock current user
export const mockUser: User = {
  id: 'demo-user-123',
  email: 'demo@example.com',
  user_metadata: {
    full_name: 'Demo User',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as User;

// Mock projects
export const mockProjects: Project[] = [
  {
    id: 'project-1',
    owner_id: 'demo-user-123',
    name: 'E-Commerce Platform',
    description: 'Complete system architecture and API documentation for our e-commerce platform',
    visibility: 'team',
    sort_order: 0,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    diagram_count: 12,
    folder_count: 4,
    member_count: 5,
  },
  {
    id: 'project-2',
    owner_id: 'demo-user-123',
    name: 'Mobile App Redesign',
    description: 'User flows and screen designs for the mobile app v2.0',
    visibility: 'private',
    sort_order: 1,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    diagram_count: 8,
    folder_count: 2,
    member_count: 3,
  },
  {
    id: 'project-3',
    owner_id: 'demo-user-123',
    name: 'Authentication System',
    description: 'OAuth flows, security diagrams, and API endpoints',
    visibility: 'team',
    sort_order: 2,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    diagram_count: 6,
    folder_count: 3,
    member_count: 2,
  },
];

// Mock folders (with nested structure)
export const mockFolders: Record<string, Folder[]> = {
  'project-1': [
    {
      id: 'folder-1',
      project_id: 'project-1',
      parent_folder_id: null,
      name: 'API Documentation',
      description: 'REST API endpoints and request/response schemas',
      sort_order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      diagram_count: 2,
      isExpanded: true,
    },
    {
      id: 'folder-1-1',
      project_id: 'project-1',
      parent_folder_id: 'folder-1',
      name: 'Client Service',
      description: 'Client management endpoints',
      sort_order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      diagram_count: 0,
    },
    {
      id: 'folder-1-2',
      project_id: 'project-1',
      parent_folder_id: 'folder-1',
      name: 'Product Service',
      description: 'Product catalog and inventory',
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      diagram_count: 0,
    },
    {
      id: 'folder-2',
      project_id: 'project-1',
      parent_folder_id: null,
      name: 'Architecture',
      description: 'System architecture and component diagrams',
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      diagram_count: 1,
      isExpanded: false,
    },
    {
      id: 'folder-3',
      project_id: 'project-1',
      parent_folder_id: null,
      name: 'User Flows',
      description: 'Customer journey and checkout flows',
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      diagram_count: 1,
      isExpanded: false,
    },
  ],
  'project-2': [
    {
      id: 'folder-4',
      project_id: 'project-2',
      parent_folder_id: null,
      name: 'Wireframes',
      description: 'Low-fidelity screen layouts',
      sort_order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      diagram_count: 0,
      isExpanded: false,
    },
    {
      id: 'folder-5',
      project_id: 'project-2',
      parent_folder_id: null,
      name: 'User Flows',
      description: 'Navigation and interaction flows',
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      diagram_count: 0,
      isExpanded: false,
    },
  ],
  'project-3': [
    {
      id: 'folder-6',
      project_id: 'project-3',
      parent_folder_id: null,
      name: 'OAuth Flows',
      description: 'Google, GitHub, and custom OAuth implementations',
      sort_order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      diagram_count: 0,
      isExpanded: false,
    },
    {
      id: 'folder-7',
      project_id: 'project-3',
      parent_folder_id: null,
      name: 'Security',
      description: 'JWT, encryption, and security best practices',
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      diagram_count: 0,
      isExpanded: false,
    },
  ],
};

// Mock members
export const mockMembers: ProjectMember[] = [
  {
    id: 'member-1',
    project_id: 'project-1',
    user_id: 'demo-user-123',
    role: 'owner',
    invited_at: new Date().toISOString(),
    joined_at: new Date().toISOString(),
    user: {
      id: 'demo-user-123',
      email: 'demo@example.com',
      full_name: 'Demo User',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
      created_at: new Date().toISOString(),
      last_sign_in: new Date().toISOString(),
    },
  },
  {
    id: 'member-2',
    project_id: 'project-1',
    user_id: 'user-2',
    role: 'admin',
    invited_at: new Date().toISOString(),
    joined_at: new Date().toISOString(),
    user: {
      id: 'user-2',
      email: 'alice@example.com',
      full_name: 'Alice Johnson',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
      created_at: new Date().toISOString(),
      last_sign_in: new Date().toISOString(),
    },
  },
  {
    id: 'member-3',
    project_id: 'project-1',
    user_id: 'user-3',
    role: 'editor',
    invited_at: new Date().toISOString(),
    joined_at: new Date().toISOString(),
    user: {
      id: 'user-3',
      email: 'bob@example.com',
      full_name: 'Bob Smith',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
      created_at: new Date().toISOString(),
      last_sign_in: new Date().toISOString(),
    },
  },
];

// Mock diagrams
export const mockDiagrams: Record<string, CloudDiagram[]> = {
  'folder-1': [
    {
      id: 'diagram-1',
      folder_id: 'folder-1',
      title: 'User Authentication Flow',
      description: 'Complete OAuth 2.0 authentication flow with Google Sign-In',
      code: `sequenceDiagram
    participant User
    participant App
    participant Google
    participant Backend
    
    User->>App: Click "Sign in with Google"
    App->>Google: Redirect to OAuth
    Google->>User: Show consent screen
    User->>Google: Approve
    Google->>App: Return auth code
    App->>Backend: Send auth code
    Backend->>Google: Exchange for tokens
    Google->>Backend: Return access token
    Backend->>App: Return session
    App->>User: Show dashboard`,
      type: 'sequence',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'demo-user-123',
    },
    {
      id: 'diagram-2',
      folder_id: 'folder-1',
      title: 'User Registration Endpoint',
      description: 'POST /api/v1/users - Create new user account',
      code: `graph TD
    A[POST /api/v1/users] --> B{Validate Input}
    B -->|Invalid| C[Return 400 Bad Request]
    B -->|Valid| D{Check Email Exists}
    D -->|Exists| E[Return 409 Conflict]
    D -->|New| F[Hash Password]
    F --> G[Create User Record]
    G --> H[Generate JWT Token]
    H --> I[Return 201 Created]`,
      type: 'endpoint',
      http_method: 'POST',
      endpoint_path: '/api/v1/users',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'demo-user-123',
    },
  ],
  'folder-2': [
    {
      id: 'diagram-3',
      folder_id: 'folder-2',
      title: 'System Architecture',
      description: 'High-level overview of the e-commerce platform architecture',
      code: `graph TB
    subgraph "Frontend"
        A[React App]
        B[Mobile App]
    end
    
    subgraph "API Gateway"
        C[Load Balancer]
        D[API Gateway]
    end
    
    subgraph "Microservices"
        E[Auth Service]
        F[Product Service]
        G[Order Service]
        H[Payment Service]
    end
    
    subgraph "Data Layer"
        I[(PostgreSQL)]
        J[(Redis Cache)]
        K[S3 Storage]
    end
    
    A --> C
    B --> C
    C --> D
    D --> E
    D --> F
    D --> G
    D --> H
    E --> I
    F --> I
    G --> I
    H --> I
    E --> J
    F --> J
    F --> K`,
      type: 'architecture',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'demo-user-123',
    },
  ],
  'folder-3': [
    {
      id: 'diagram-4',
      folder_id: 'folder-3',
      title: 'Checkout Flow',
      description: 'Customer journey from cart to order confirmation',
      code: `graph TD
    A[Shopping Cart] --> B{Items in Cart?}
    B -->|No| C[Browse Products]
    B -->|Yes| D[Review Cart]
    D --> E{Logged In?}
    E -->|No| F[Sign In / Register]
    E -->|Yes| G[Enter Shipping Info]
    F --> G
    G --> H[Select Shipping Method]
    H --> I[Enter Payment Info]
    I --> J[Review Order]
    J --> K{Confirm?}
    K -->|No| D
    K -->|Yes| L[Process Payment]
    L --> M{Payment Success?}
    M -->|No| N[Show Error]
    M -->|Yes| O[Create Order]
    O --> P[Send Confirmation Email]
    P --> Q[Show Success Page]
    N --> I`,
      type: 'workflow',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'demo-user-123',
    },
  ],
};

// Check if demo mode is enabled
export const isDemoMode = (): boolean => {
  return localStorage.getItem('DEMO_MODE') === 'true';
};

// Enable demo mode
export const enableDemoMode = (): void => {
  localStorage.setItem('DEMO_MODE', 'true');
  window.location.reload();
};

// Disable demo mode
export const disableDemoMode = (): void => {
  localStorage.removeItem('DEMO_MODE');
  window.location.reload();
};
