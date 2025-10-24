import type { TranslationKeys } from './en';

export const es: TranslationKeys = {
  // App
  app: {
    title: 'Mermaid Studio Pro',
    subtitle: 'Crea, organiza y exporta diagramas Mermaid ricos con herramientas modernas.',
  },
  
  // Buttons
  button: {
    addDiagram: 'Agregar Diagrama',
    exportJSON: 'Exportar JSON',
    importJSON: 'Importar JSON',
    downloadAll: 'Descargar Todo',
    clearAll: 'Limpiar Todo',
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    copy: 'Copiar',
    copied: '¡Copiado!',
  },
  
  // Search & Filters
  search: {
    placeholder: 'Buscar diagramas por título, descripción o etiquetas...',
  },
  filter: {
    type: 'Tipo:',
    allTypes: 'Todos los Tipos',
  },
  
  // Pagination
  pagination: {
    total: 'Total',
    showing: 'Mostrando',
    of: 'de',
  },
  
  // Footer
  footer: {
    copyright: 'Mermaid Studio Pro',
    implementedWith: 'Implementado con',
    by: 'por',
    poweredBy: 'Impulsado por',
  },
  
  // AI Assistant
  ai: {
    title: 'Asistente IA',
    placeholder: 'Pregunta a la IA sobre diagramas...',
    generate: 'Generar',
    modify: 'Modificar',
    explain: 'Explicar',
    accept: 'Aceptar Cambios',
    acceptAndAdd: 'Aceptar y Agregar Diagrama',
    acceptAndUpdate: 'Aceptar y Actualizar Diagrama',
    reject: 'Rechazar',
    thinking: 'IA está pensando...',
    quickActions: 'Acciones Rápidas',
    settings: 'Configuración',
    welcome: 'Bienvenido al Asistente IA',
    welcomeSubtitle: 'Pídeme que genere, modifique o explique diagramas',
    reviewChanges: 'Revisar Cambios',
    reviewSuggestion: 'Revisar Sugerencia de IA',
    preview: 'Vista Previa',
    mermaidCode: 'Código Mermaid',
    explanation: 'Explicación',
    error: 'Lo siento, encontré un error',
    invalidSyntax: 'Sintaxis Mermaid inválida generada',
    clearChat: 'Limpiar chat',
    editingDiagram: 'Editando',
    
    // Quick Actions
    quickAction: {
      generateWorkflow: 'Generar Flujo de Trabajo',
      apiEndpoint: 'Endpoint de API',
      architecture: 'Arquitectura',
    },
    
    // Toasts
    toast: {
      generated: '¡Diagrama generado! Revisa y acepta para agregarlo.',
      updated: '¡Diagrama actualizado exitosamente!',
      added: '¡Diagrama agregado exitosamente!',
      rejected: 'Sugerencia rechazada',
      cleared: 'Chat limpiado',
      codeCopied: '¡Código copiado al portapapeles!',
      copyFailed: 'Error al copiar código',
    },
  },
  
  // DiagramForm
  form: {
    title: {
      add: 'Agregar Nuevo Diagrama',
      edit: 'Editar Diagrama',
    },
    proTip: {
      title: 'Consejo Profesional',
      message: 'Usa tipos de diagramas para organizar tu documentación. Los diagramas Endpoint/API incluyen campos especiales para payloads de solicitud/respuesta, mientras que los diagramas de Flujo de Trabajo ayudan a documentar procesos de negocio.',
    },
    field: {
      type: 'Tipo de Diagrama',
      typePlaceholder: 'Selecciona un tipo...',
      typeOptions: {
        workflow: 'Flujo de Trabajo - Flujos de procesos de negocio',
        endpoint: 'Endpoint/API - Documentación de API con payloads',
        architecture: 'Arquitectura - Diagramas de diseño de sistemas',
        sequence: 'Secuencia - Diagramas de interacción',
        state: 'Máquina de Estados - Transiciones de estado',
        other: 'Otro - Propósito general',
      },
      title: 'Título',
      titlePlaceholder: 'Ingresa el título del diagrama',
      description: 'Descripción',
      descriptionPlaceholder: 'Ingresa la descripción del diagrama (opcional)',
      tags: 'Etiquetas',
      tagsPlaceholder: 'etiquetas, separadas, por, comas',
      code: 'Código Mermaid',
    },
    button: {
      copy: 'Copiar',
      save: 'Guardar Diagrama',
      cancel: 'Cancelar',
    },
    error: {
      required: 'Por favor completa todos los campos requeridos',
    },
    success: {
      created: '¡Diagrama creado exitosamente!',
      updated: '¡Diagrama actualizado exitosamente!',
    },
  },
  
  // WorkflowFields
  workflow: {
    title: 'Detalles del Flujo de Trabajo',
    actors: 'Actores/Participantes',
    actorsPlaceholder: 'ej., Usuario, Sistema, Admin (separados por comas)',
    trigger: 'Evento Disparador',
    triggerPlaceholder: 'ej., Usuario hace clic en el botón de inicio de sesión',
  },
  
  // EndpointFields
  endpoint: {
    title: 'Detalles del Endpoint API',
    method: 'Método HTTP',
    methodPlaceholder: 'Selecciona método...',
    path: 'Ruta del Endpoint',
    pathPlaceholder: '/api/v1/usuarios/{id}',
    request: {
      title: 'Payloads de Solicitud',
      add: 'Agregar Solicitud',
      number: 'Solicitud',
      remove: 'Eliminar',
      status: 'Estado',
      statusPlaceholder: 'ej., Requerido',
      contentType: 'Tipo de Contenido',
      contentTypePlaceholder: 'application/json',
      json: 'Payload JSON',
      jsonPlaceholder: '{"clave": "valor"}',
    },
    response: {
      title: 'Payloads de Respuesta',
      add: 'Agregar Respuesta',
      number: 'Respuesta',
      statusCode: 'Código de Estado',
      statusCodePlaceholder: '200',
    },
  },
  
  // InfoModal
  info: {
    title: 'Detalles del Diagrama',
    created: 'Creado',
    updated: 'Actualizado',
    tags: 'Etiquetas',
    code: 'Código Mermaid',
    endpoint: {
      title: 'Información del Endpoint',
      method: 'Método',
      path: 'Ruta',
    },
  },
  
  // DiffPreview
  diff: {
    title: {
      review: 'Revisar Sugerencia de IA',
      changes: 'Revisar Cambios',
    },
    explanation: 'Explicación',
    preview: 'Vista Previa',
    code: 'Código Mermaid',
    button: {
      copy: 'Copiar',
      accept: 'Aceptar y Agregar Diagrama',
      update: 'Aceptar y Actualizar Diagrama',
      saveAsNew: 'Guardar como Nuevo',
      saveAsNewTooltip: 'Crear un nuevo diagrama en lugar de actualizar el actual',
      reject: 'Rechazar',
    },
  },
  
  // ZoomModal
  zoom: {
    editWithAI: 'Editar con IA',
    zoomIn: 'Acercar (+)',
    zoomOut: 'Alejar (-)',
    reset: 'Restablecer (0)',
    focus: 'Enfocar',
    exitFocus: 'Salir de Enfoque',
    enterFocusMode: 'Entrar en Modo Enfoque (F)',
    exitFocusMode: 'Salir del Modo Enfoque (F)',
    keyboardShortcuts: 'Atajos de Teclado',
    shortcuts: {
      zoomIn: 'Acercar:',
      zoomOut: 'Alejar:',
      reset: 'Restablecer:',
      close: 'Cerrar:',
      focusMode: 'Modo Enfoque:',
      pan: 'Clic y arrastrar para desplazar',
    },
  },
  
  // Quick Actions
  quickActions: {
    title: 'Acciones Rápidas',
    workflow: 'Flujo de Trabajo',
    endpoint: 'API Endpoint',
    architecture: 'Arquitectura',
    sequence: 'Secuencia',
    state: 'Máquina de Estados',
    prompts: {
      workflow: 'Crear un diagrama de flujo de inicio de sesión de usuario',
      endpoint: 'Crear un endpoint REST API para autenticación de usuario',
      architecture: 'Crear un diagrama de arquitectura de microservicios',
      sequence: 'Crear un diagrama de secuencia para procesamiento de pagos',
      state: 'Crear una máquina de estados para estado de pedido',
    },
  },
  
  // Modals
  modal: {
    delete: {
      title: 'Eliminar Diagrama',
      message: '¿Estás seguro de que quieres eliminar "{title}"? Esta acción no se puede deshacer.',
      confirm: 'Eliminar',
      cancel: 'Cancelar',
    },
  },
  
  // Collaboration Features
  dashboard: {
    title: 'Mis Proyectos',
    subtitle: 'Gestiona y organiza tus proyectos de diagramas',
    newProject: 'Nuevo Proyecto',
    noProjects: 'Aún no hay proyectos',
    noProjectsDesc: 'Crea tu primer proyecto para comenzar',
    createFirst: 'Crea Tu Primer Proyecto',
    loading: 'Cargando proyectos...',
    projectCount: '{count} proyecto(s)',
  },
  
  project: {
    backToDashboard: 'Volver al Panel',
    share: 'Compartir',
    settings: 'Configuración',
    newFolder: 'Nueva Carpeta',
    addFolder: 'Agregar Carpeta',
    folders: 'Carpetas',
    noFolders: 'Aún no hay carpetas',
    noFoldersDesc: 'Crea carpetas para organizar tus diagramas',
    createFolder: 'Crear Carpeta',
    noDiagrams: 'No hay diagramas en esta carpeta',
    noDiagramsDesc: 'Agrega tu primer diagrama para comenzar',
    addDiagram: 'Agregar Diagrama',
    loading: 'Cargando proyecto...',
    folderCount: '{count} carpeta(s)',
    diagramCount: '{count} diagrama(s)',
  },
  
  share: {
    title: 'Compartir Proyecto',
    invitePeople: 'Invitar Personas',
    emailPlaceholder: 'Ingresa dirección de correo',
    selectRole: 'Seleccionar rol',
    addMember: 'Agregar Miembro',
    teamMembers: 'Miembros del Equipo',
    you: 'Tú',
    owner: 'Propietario',
    admin: 'Administrador',
    editor: 'Editor',
    viewer: 'Visualizador',
    changeRole: 'Cambiar Rol',
    remove: 'Eliminar',
    shareLink: 'Enlace para Compartir',
    copyLink: 'Copiar Enlace',
    linkCopied: '¡Enlace copiado al portapapeles!',
    close: 'Cerrar',
    inviteSuccess: '¡Usuario invitado exitosamente!',
    inviteError: 'Error al invitar usuario',
    userNotFound: 'Usuario no encontrado. Necesita registrarse primero.',
    removeSuccess: '¡Miembro eliminado exitosamente!',
    removeError: 'Error al eliminar miembro',
    roleUpdateSuccess: '¡Rol actualizado exitosamente!',
    roleUpdateError: 'Error al actualizar rol',
    memberCount: '{count} miembro(s)',
  },
  
  projectSettings: {
    title: 'Configuración del Proyecto',
    settings: 'Configuración',
    projectName: 'Nombre del Proyecto',
    projectNamePlaceholder: 'Ingresa nombre del proyecto',
    description: 'Descripción',
    descriptionPlaceholder: 'Ingresa descripción del proyecto',
    visibility: 'Visibilidad',
    private: 'Privado',
    team: 'Equipo',
    dangerZone: 'Zona de Peligro',
    deleteProject: 'Eliminar Proyecto',
    deleteWarning: 'Esta acción no se puede deshacer. Todos los diagramas y carpetas serán eliminados permanentemente.',
    deleteButton: 'Eliminar Proyecto',
    cancel: 'Cancelar',
    save: 'Guardar Cambios',
    saveSuccess: '¡Proyecto actualizado exitosamente!',
    saveError: 'Error al actualizar proyecto',
    deleteSuccess: '¡Proyecto eliminado exitosamente!',
    deleteError: 'Error al eliminar proyecto',
  },
  
  userMenu: {
    signIn: 'Iniciar Sesión con Google',
    signOut: 'Cerrar Sesión',
    preferences: 'Preferencias',
    settings: 'Configuración',
    profile: 'Perfil',
    signInSuccess: '¡Sesión iniciada exitosamente!',
    signInError: 'Error al iniciar sesión',
    signOutSuccess: '¡Sesión cerrada exitosamente!',
    signOutError: 'Error al cerrar sesión',
  },
  
  folder: {
    createTitle: 'Crear Carpeta',
    editTitle: 'Editar Carpeta',
    folderName: 'Nombre de Carpeta',
    folderNamePlaceholder: 'Ingresa nombre de carpeta',
    description: 'Descripción',
    descriptionPlaceholder: 'Ingresa descripción de carpeta (opcional)',
    parentFolder: 'Carpeta Padre',
    selectParent: 'Seleccionar carpeta padre',
    rootLevel: 'Nivel Raíz',
    cancel: 'Cancelar',
    create: 'Crear Carpeta',
    save: 'Guardar Cambios',
    delete: 'Eliminar Carpeta',
    deleteWarning: '¿Estás seguro de que quieres eliminar esta carpeta?',
    deleteWithDiagrams: 'Esta carpeta contiene {count} diagrama(s). Escribe el nombre de la carpeta para confirmar la eliminación:',
    confirmPlaceholder: 'Escribe el nombre de la carpeta para confirmar',
    createSuccess: '¡Carpeta creada exitosamente!',
    createError: 'Error al crear carpeta',
    updateSuccess: '¡Carpeta actualizada exitosamente!',
    updateError: 'Error al actualizar carpeta',
    deleteSuccess: '¡Carpeta eliminada exitosamente!',
    deleteError: 'Error al eliminar carpeta',
    addSubfolder: 'Agregar Subcarpeta',
    edit: 'Editar',
  },
  
  settings: {
    title: 'Configuración',
    subtitle: 'Gestiona tu cuenta, preferencias y configuración de IA',
    profile: 'Perfil',
    aiConfig: 'Configuración de IA',
    preferences: 'Preferencias',
    account: 'Cuenta',
    
    // Profile
    profileTitle: 'Información del Perfil',
    profileSubtitle: 'Tu información de perfil es gestionada por tu cuenta de Google.',
    fullName: 'Nombre Completo',
    email: 'Correo Electrónico',
    avatar: 'Avatar',
    profileNote: 'Para actualizar tu información de perfil, visita la configuración de tu cuenta de Google.',
    
    // AI Config
    aiConfigTitle: 'Configuración de IA',
    aiConfigSubtitle: 'Configura tu proveedor de IA y credenciales para la generación de diagramas.',
    aiProvider: 'Proveedor de IA',
    apiUrl: 'URL de API',
    clientId: 'ID de Cliente',
    clientSecret: 'Secreto de Cliente',
    tenant: 'Inquilino',
    agent: 'Agente',
    apiKey: 'Clave de API',
    saveConfig: 'Guardar Configuración',
    credentialsEncrypted: '🔒 Las credenciales se cifran antes del almacenamiento',
    saving: 'Guardando...',
    loading: 'Cargando...',
    
    // Preferences
    preferencesTitle: 'Preferencias',
    preferencesSubtitle: 'Personaliza tu experiencia con configuraciones de tema e idioma.',
    theme: 'Tema',
    light: 'Claro',
    dark: 'Oscuro',
    language: 'Idioma',
    savePreferences: 'Guardar Preferencias',
    
    // Account
    accountTitle: 'Gestión de Cuenta',
    accountSubtitle: 'Gestiona la configuración y datos de tu cuenta.',
    signOut: 'Cerrar Sesión',
    signOutDesc: 'Cierra sesión de tu cuenta en este dispositivo.',
    deleteAccount: 'Eliminar Cuenta',
    deleteAccountWarning: 'Eliminar permanentemente tu cuenta y todos los datos asociados. Esta acción no se puede deshacer.',
    
    // Toast messages
    saveSuccess: '¡Configuración guardada exitosamente!',
    saveError: 'Error al guardar configuración',
    configSaveSuccess: 'Configuración de IA guardada exitosamente',
    configSaveError: 'Error al guardar',
    prefSaveSuccess: 'Preferencias guardadas exitosamente',
    prefSaveError: 'Error al guardar preferencias',
    mustBeLoggedIn: 'Debes iniciar sesión para guardar preferencias',
    loadCredentialsError: 'Error al cargar credenciales',
  },
} as const;
