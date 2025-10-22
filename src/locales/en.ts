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
};

export type TranslationKeys = typeof en;
