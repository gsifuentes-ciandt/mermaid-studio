export const en = {
  // App
  app: {
    title: 'Mermaid Studio Pro',
    subtitle: 'Create, organize, and export rich Mermaid diagrams with modern tooling.',
  },
  
  // Buttons
  button: {
    addDiagram: 'Add Diagram',
    exportJSON: 'Export JSON',
    importJSON: 'Import JSON',
    downloadAll: 'Download All',
    clearAll: 'Clear All',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    copy: 'Copy',
    copied: 'Copied!',
  },
  
  // Search & Filters
  search: {
    placeholder: 'Search diagrams by title, description, or tags...',
  },
  filter: {
    type: 'Type:',
    allTypes: 'All Types',
  },
  
  // Pagination
  pagination: {
    total: 'Total',
    showing: 'Showing',
    of: 'of',
  },
  
  // Footer
  footer: {
    copyright: 'Mermaid Studio Pro',
    implementedWith: 'Implemented with',
    by: 'by',
    poweredBy: 'Powered by',
  },
  
  // AI Assistant
  ai: {
    title: 'AI Assistant',
    placeholder: 'Ask AI to help with diagrams...',
    generate: 'Generate',
    modify: 'Modify',
    explain: 'Explain',
    accept: 'Accept Changes',
    acceptAndAdd: 'Accept & Add Diagram',
    acceptAndUpdate: 'Accept & Update Diagram',
    reject: 'Reject',
    thinking: 'AI is thinking...',
    quickActions: 'Quick Actions',
    settings: 'Settings',
    welcome: 'Welcome to AI Assistant',
    welcomeSubtitle: 'Ask me to generate, modify, or explain diagrams',
    reviewChanges: 'Review Changes',
    reviewSuggestion: 'Review AI Suggestion',
    preview: 'Preview',
    mermaidCode: 'Mermaid Code',
    explanation: 'Explanation',
    error: 'Sorry, I encountered an error',
    invalidSyntax: 'Generated invalid Mermaid syntax',
    clearChat: 'Clear chat',
    editingDiagram: 'Editing',
    
    // Quick Actions
    quickAction: {
      generateWorkflow: 'Generate Workflow',
      apiEndpoint: 'API Endpoint',
      architecture: 'Architecture',
    },
    
    // Toasts
    toast: {
      generated: 'Diagram generated! Review and accept to add it.',
      updated: 'Diagram updated successfully!',
      added: 'Diagram added successfully!',
      rejected: 'Suggestion rejected',
      cleared: 'Chat cleared',
      codeCopied: 'Code copied to clipboard!',
      copyFailed: 'Failed to copy code',
    },
  },
  
  // DiagramForm
  form: {
    title: {
      add: 'Add New Diagram',
      edit: 'Edit Diagram',
    },
    proTip: {
      title: 'Pro Tip',
      message: 'Use diagram types to organize your documentation. Endpoint/API diagrams include special fields for request/response payloads, while Workflow diagrams help document business processes.',
    },
    field: {
      type: 'Diagram Type',
      typePlaceholder: 'Select a type...',
      typeOptions: {
        workflow: 'Workflow - Business process flows',
        endpoint: 'Endpoint/API - API documentation with payloads',
        architecture: 'Architecture - System design diagrams',
        sequence: 'Sequence - Interaction diagrams',
        state: 'State Machine - State transitions',
        other: 'Other - General purpose',
      },
      title: 'Title',
      titlePlaceholder: 'Enter diagram title',
      description: 'Description',
      descriptionPlaceholder: 'Enter diagram description (optional)',
      tags: 'Tags',
      tagsPlaceholder: 'comma, separated, tags',
      code: 'Mermaid Code',
    },
    button: {
      copy: 'Copy',
      save: 'Save Diagram',
      cancel: 'Cancel',
    },
    error: {
      required: 'Please fill in all required fields',
    },
    success: {
      created: 'Diagram created successfully!',
      updated: 'Diagram updated successfully!',
    },
  },
  
  // WorkflowFields
  workflow: {
    title: 'Workflow Details',
    actors: 'Actors/Participants',
    actorsPlaceholder: 'e.g., User, System, Admin (comma-separated)',
    trigger: 'Trigger Event',
    triggerPlaceholder: 'e.g., User clicks login button',
  },
  
  // EndpointFields
  endpoint: {
    title: 'API Endpoint Details',
    method: 'HTTP Method',
    methodPlaceholder: 'Select method...',
    path: 'Endpoint Path',
    pathPlaceholder: '/api/v1/users/{id}',
    request: {
      title: 'Request Payloads',
      add: 'Add Request',
      number: 'Request',
      remove: 'Remove',
      status: 'Status',
      statusPlaceholder: 'e.g., Required',
      contentType: 'Content Type',
      contentTypePlaceholder: 'application/json',
      json: 'JSON Payload',
      jsonPlaceholder: '{"key": "value"}',
    },
    response: {
      title: 'Response Payloads',
      add: 'Add Response',
      number: 'Response',
      statusCode: 'Status Code',
      statusCodePlaceholder: '200',
    },
  },
  
  // InfoModal
  info: {
    title: 'Diagram Details',
    created: 'Created',
    updated: 'Updated',
    tags: 'Tags',
    code: 'Mermaid Code',
    endpoint: {
      title: 'Endpoint Information',
      method: 'Method',
      path: 'Path',
    },
  },
  
  // DiffPreview
  diff: {
    title: {
      review: 'Review AI Suggestion',
      changes: 'Review Changes',
    },
    explanation: 'Explanation',
    preview: 'Preview',
    code: 'Mermaid Code',
    button: {
      copy: 'Copy',
      accept: 'Accept & Add Diagram',
      update: 'Accept & Update Diagram',
      saveAsNew: 'Save as New',
      saveAsNewTooltip: 'Create a new diagram instead of updating the current one',
      reject: 'Reject',
    },
  },
  
  // ZoomModal
  zoom: {
    editWithAI: 'Edit with AI',
    zoomIn: 'Zoom In (+)',
    zoomOut: 'Zoom Out (-)',
    reset: 'Reset (0)',
    focus: 'Focus',
    exitFocus: 'Exit Focus',
    enterFocusMode: 'Enter Focus Mode (F)',
    exitFocusMode: 'Exit Focus Mode (F)',
    keyboardShortcuts: 'Keyboard Shortcuts',
    shortcuts: {
      zoomIn: 'Zoom In:',
      zoomOut: 'Zoom Out:',
      reset: 'Reset:',
      close: 'Close:',
      focusMode: 'Focus Mode:',
      pan: 'Click & drag to pan',
    },
  },
  
  // Quick Actions
  quickActions: {
    title: 'Quick Actions',
    workflow: 'Workflow',
    endpoint: 'API Endpoint',
    architecture: 'Architecture',
    sequence: 'Sequence',
    state: 'State Machine',
    prompts: {
      workflow: 'Create a user login workflow diagram',
      endpoint: 'Create a REST API endpoint for user authentication',
      architecture: 'Create a microservices architecture diagram',
      sequence: 'Create a sequence diagram for payment processing',
      state: 'Create a state machine for order status',
    },
  },
  
  // Modals
  modal: {
    delete: {
      title: 'Delete Diagram',
      message: 'Are you sure you want to delete "{title}"? This action cannot be undone.',
      confirm: 'Delete',
      cancel: 'Cancel',
    },
  },
  
  // Collaboration Features
  dashboard: {
    title: 'My Projects',
    subtitle: 'Manage and organize your diagram projects',
    newProject: 'New Project',
    noProjects: 'No projects yet',
    noProjectsDesc: 'Create your first project to get started',
    createFirst: 'Create Your First Project',
    loading: 'Loading projects...',
    projectCount: '{count} project(s)',
  },
  
  project: {
    backToDashboard: 'Back to Dashboard',
    share: 'Share',
    settings: 'Settings',
    newFolder: 'New Folder',
    addFolder: 'Add Folder',
    folders: 'Folders',
    noFolders: 'No folders yet',
    noFoldersDesc: 'Create folders to organize your diagrams',
    createFolder: 'Create Folder',
    noDiagrams: 'No diagrams in this folder',
    noDiagramsDesc: 'Add your first diagram to get started',
    addDiagram: 'Add Diagram',
    loading: 'Loading project...',
    folderCount: '{count} folder(s)',
    diagramCount: '{count} diagram(s)',
  },
  
  share: {
    title: 'Share Project',
    invitePeople: 'Invite People',
    emailPlaceholder: 'Enter email address',
    selectRole: 'Select role',
    addMember: 'Add Member',
    teamMembers: 'Team Members',
    you: 'You',
    owner: 'Owner',
    admin: 'Admin',
    editor: 'Editor',
    viewer: 'Viewer',
    changeRole: 'Change Role',
    remove: 'Remove',
    shareLink: 'Share Link',
    copyLink: 'Copy Link',
    linkCopied: 'Link copied to clipboard!',
    close: 'Close',
    inviteSuccess: 'User invited successfully!',
    inviteError: 'Failed to invite user',
    userNotFound: 'User not found. They need to sign up first.',
    removeSuccess: 'Member removed successfully!',
    removeError: 'Failed to remove member',
    roleUpdateSuccess: 'Role updated successfully!',
    roleUpdateError: 'Failed to update role',
    memberCount: '{count} member(s)',
  },
  
  projectSettings: {
    title: 'Project Settings',
    settings: 'Settings',
    projectName: 'Project Name',
    projectNamePlaceholder: 'Enter project name',
    description: 'Description',
    descriptionPlaceholder: 'Enter project description',
    visibility: 'Visibility',
    private: 'Private',
    team: 'Team',
    dangerZone: 'Danger Zone',
    deleteProject: 'Delete Project',
    deleteWarning: 'This action cannot be undone. All diagrams and folders will be permanently deleted.',
    deleteButton: 'Delete Project',
    cancel: 'Cancel',
    save: 'Save Changes',
    saveSuccess: 'Project updated successfully!',
    saveError: 'Failed to update project',
    deleteSuccess: 'Project deleted successfully!',
    deleteError: 'Failed to delete project',
  },
  
  userMenu: {
    signIn: 'Sign In with Google',
    signOut: 'Sign Out',
    preferences: 'Preferences',
    settings: 'Settings',
    profile: 'Profile',
    signInSuccess: 'Signed in successfully!',
    signInError: 'Failed to sign in',
    signOutSuccess: 'Signed out successfully!',
    signOutError: 'Failed to sign out',
  },
  
  folder: {
    createTitle: 'Create Folder',
    editTitle: 'Edit Folder',
    folderName: 'Folder Name',
    folderNamePlaceholder: 'Enter folder name',
    description: 'Description',
    descriptionPlaceholder: 'Enter folder description (optional)',
    parentFolder: 'Parent Folder',
    selectParent: 'Select parent folder',
    rootLevel: 'Root Level',
    cancel: 'Cancel',
    create: 'Create Folder',
    save: 'Save Changes',
    delete: 'Delete Folder',
    deleteWarning: 'Are you sure you want to delete this folder?',
    deleteWithDiagrams: 'This folder contains {count} diagram(s). Type the folder name to confirm deletion:',
    confirmPlaceholder: 'Type folder name to confirm',
    createSuccess: 'Folder created successfully!',
    createError: 'Failed to create folder',
    updateSuccess: 'Folder updated successfully!',
    updateError: 'Failed to update folder',
    deleteSuccess: 'Folder deleted successfully!',
    deleteError: 'Failed to delete folder',
    addSubfolder: 'Add Subfolder',
    edit: 'Edit',
  },
  
  settings: {
    title: 'Settings',
    subtitle: 'Manage your account, preferences, and AI configuration',
    profile: 'Profile',
    aiConfig: 'AI Configuration',
    preferences: 'Preferences',
    account: 'Account',
    
    // Profile
    profileTitle: 'Profile Information',
    profileSubtitle: 'Your profile information is managed by your Google account.',
    fullName: 'Full Name',
    email: 'Email',
    avatar: 'Avatar',
    profileNote: 'To update your profile information, please visit your Google account settings.',
    
    // AI Config
    aiConfigTitle: 'AI Configuration',
    aiConfigSubtitle: 'Configure your AI provider and credentials for diagram generation.',
    aiProvider: 'AI Provider',
    apiUrl: 'API URL',
    clientId: 'Client ID',
    clientSecret: 'Client Secret',
    tenant: 'Tenant',
    agent: 'Agent',
    apiKey: 'API Key',
    saveConfig: 'Save Configuration',
    credentialsEncrypted: '🔒 Credentials are encrypted before storage',
    saving: 'Saving...',
    loading: 'Loading...',
    
    // Preferences
    preferencesTitle: 'Preferences',
    preferencesSubtitle: 'Customize your experience with theme and language settings.',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    language: 'Language',
    savePreferences: 'Save Preferences',
    
    // Account
    accountTitle: 'Account Management',
    accountSubtitle: 'Manage your account settings and data.',
    signOut: 'Sign Out',
    signOutDesc: 'Sign out of your account on this device.',
    deleteAccount: 'Delete Account',
    deleteAccountWarning: 'Permanently delete your account and all associated data. This action cannot be undone.',
    
    // Toast messages
    saveSuccess: 'Settings saved successfully!',
    saveError: 'Failed to save settings',
    configSaveSuccess: 'AI configuration saved successfully',
    configSaveError: 'Failed to save',
    prefSaveSuccess: 'Preferences saved successfully',
    prefSaveError: 'Failed to save preferences',
    mustBeLoggedIn: 'You must be logged in to save preferences',
    loadCredentialsError: 'Failed to load credentials',
  },
};

export type TranslationKeys = typeof en;
