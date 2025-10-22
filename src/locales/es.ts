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
} as const;
