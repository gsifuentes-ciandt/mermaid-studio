import type { TranslationKeys } from './en';

export const pt: TranslationKeys = {
  // App
  app: {
    title: 'Mermaid Studio Pro',
    subtitle: 'Crie, organize e exporte diagramas Mermaid ricos com ferramentas modernas.',
  },
  
  // Buttons
  button: {
    addDiagram: 'Adicionar Diagrama',
    exportJSON: 'Exportar JSON',
    importJSON: 'Importar JSON',
    downloadAll: 'Baixar Tudo',
    clearAll: 'Limpar Tudo',
    cancel: 'Cancelar',
    save: 'Salvar',
    delete: 'Excluir',
    edit: 'Editar',
    copy: 'Copiar',
    copied: 'Copiado!',
  },
  
  // Search & Filters
  search: {
    placeholder: 'Pesquisar diagramas por título, descrição ou tags...',
  },
  filter: {
    type: 'Tipo:',
    allTypes: 'Todos os Tipos',
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
    implementedWith: 'Implementado com',
    by: 'por',
    poweredBy: 'Impulsionado com',
  },
  
  // AI Assistant
  ai: {
    title: 'Assistente IA',
    placeholder: 'Pergunte à IA sobre diagramas...',
    generate: 'Gerar',
    modify: 'Modificar',
    explain: 'Explicar',
    accept: 'Aceitar Mudanças',
    acceptAndAdd: 'Aceitar e Adicionar Diagrama',
    acceptAndUpdate: 'Aceitar e Atualizar Diagrama',
    reject: 'Rejeitar',
    thinking: 'IA está pensando...',
    quickActions: 'Ações Rápidas',
    settings: 'Configurações',
    welcome: 'Bem-vindo ao Assistente IA',
    welcomeSubtitle: 'Peça-me para gerar, modificar ou explicar diagramas',
    reviewChanges: 'Revisar Alterações',
    reviewSuggestion: 'Revisar Sugestão da IA',
    preview: 'Visualização',
    mermaidCode: 'Código Mermaid',
    explanation: 'Explicação',
    error: 'Desculpe, encontrei um erro',
    invalidSyntax: 'Sintaxe Mermaid inválida gerada',
    clearChat: 'Limpar chat',
    editingDiagram: 'Editando',
    
    // Quick Actions
    quickAction: {
      generateWorkflow: 'Gerar Fluxo de Trabalho',
      apiEndpoint: 'Endpoint de API',
      architecture: 'Arquitetura',
    },
    
    // Toasts
    toast: {
      generated: 'Diagrama gerado! Revise e aceite para adicioná-lo.',
      updated: 'Diagrama atualizado com sucesso!',
      added: 'Diagrama adicionado com sucesso!',
      rejected: 'Sugestão rejeitada',
      cleared: 'Chat limpo',
      codeCopied: 'Código copiado para a área de transferência!',
      copyFailed: 'Falha ao copiar código',
    },
  },
  
  // DiagramForm
  form: {
    title: {
      add: 'Adicionar Novo Diagrama',
      edit: 'Editar Diagrama',
    },
    proTip: {
      title: 'Dica Profissional',
      message: 'Use tipos de diagramas para organizar sua documentação. Diagramas Endpoint/API incluem campos especiais para payloads de requisição/resposta, enquanto diagramas de Fluxo de Trabalho ajudam a documentar processos de negócio.',
    },
    field: {
      type: 'Tipo de Diagrama',
      typePlaceholder: 'Selecione um tipo...',
      typeOptions: {
        workflow: 'Fluxo de Trabalho - Fluxos de processos de negócio',
        endpoint: 'Endpoint/API - Documentação de API com payloads',
        architecture: 'Arquitetura - Diagramas de design de sistemas',
        sequence: 'Sequência - Diagramas de interação',
        state: 'Máquina de Estados - Transições de estado',
        other: 'Outro - Propósito geral',
      },
      title: 'Título',
      titlePlaceholder: 'Digite o título do diagrama',
      description: 'Descrição',
      descriptionPlaceholder: 'Digite a descrição do diagrama (opcional)',
      tags: 'Tags',
      tagsPlaceholder: 'tags, separadas, por, vírgulas',
      code: 'Código Mermaid',
    },
    button: {
      copy: 'Copiar',
      save: 'Salvar Diagrama',
      cancel: 'Cancelar',
    },
    error: {
      required: 'Por favor, preencha todos os campos obrigatórios',
    },
    success: {
      created: 'Diagrama criado com sucesso!',
      updated: 'Diagrama atualizado com sucesso!',
    },
  },
  
  // WorkflowFields
  workflow: {
    title: 'Detalhes do Fluxo de Trabalho',
    actors: 'Atores/Participantes',
    actorsPlaceholder: 'ex., Usuário, Sistema, Admin (separados por vírgulas)',
    trigger: 'Evento Gatilho',
    triggerPlaceholder: 'ex., Usuário clica no botão de login',
  },
  
  // EndpointFields
  endpoint: {
    title: 'Detalhes do Endpoint API',
    method: 'Método HTTP',
    methodPlaceholder: 'Selecione o método...',
    path: 'Caminho do Endpoint',
    pathPlaceholder: '/api/v1/usuarios/{id}',
    request: {
      title: 'Payloads de Requisição',
      add: 'Adicionar Requisição',
      number: 'Requisição',
      remove: 'Remover',
      status: 'Status',
      statusPlaceholder: 'ex., Obrigatório',
      contentType: 'Tipo de Conteúdo',
      contentTypePlaceholder: 'application/json',
      json: 'Payload JSON',
      jsonPlaceholder: '{"chave": "valor"}',
    },
    response: {
      title: 'Payloads de Resposta',
      add: 'Adicionar Resposta',
      number: 'Resposta',
      statusCode: 'Código de Status',
      statusCodePlaceholder: '200',
    },
  },
  
  // InfoModal
  info: {
    title: 'Detalhes do Diagrama',
    created: 'Criado',
    updated: 'Atualizado',
    tags: 'Tags',
    code: 'Código Mermaid',
    endpoint: {
      title: 'Informações do Endpoint',
      method: 'Método',
      path: 'Caminho',
    },
  },
  
  // DiffPreview
  diff: {
    title: {
      review: 'Revisar Sugestão da IA',
      changes: 'Revisar Alterações',
    },
    explanation: 'Explicação',
    preview: 'Visualização',
    code: 'Código Mermaid',
    button: {
      copy: 'Copiar',
      accept: 'Aceitar e Adicionar Diagrama',
      update: 'Aceitar e Atualizar Diagrama',
      saveAsNew: 'Salvar como Novo',
      saveAsNewTooltip: 'Criar um novo diagrama em vez de atualizar o atual',
      reject: 'Rejeitar',
    },
  },
  
  // ZoomModal
  zoom: {
    editWithAI: 'Editar com IA',
    zoomIn: 'Aumentar Zoom (+)',
    zoomOut: 'Diminuir Zoom (-)',
    reset: 'Redefinir (0)',
    focus: 'Focar',
    exitFocus: 'Sair do Foco',
    enterFocusMode: 'Entrar no Modo Foco (F)',
    exitFocusMode: 'Sair do Modo Foco (F)',
    keyboardShortcuts: 'Atalhos de Teclado',
    shortcuts: {
      zoomIn: 'Aumentar Zoom:',
      zoomOut: 'Diminuir Zoom:',
      reset: 'Redefinir:',
      close: 'Fechar:',
      focusMode: 'Modo Foco:',
      pan: 'Clique e arraste para mover',
    },
  },
  
  // Quick Actions
  quickActions: {
    title: 'Ações Rápidas',
    workflow: 'Fluxo de Trabalho',
    endpoint: 'API Endpoint',
    architecture: 'Arquitetura',
    sequence: 'Sequência',
    state: 'Máquina de Estados',
    prompts: {
      workflow: 'Criar um diagrama de fluxo de login de usuário',
      endpoint: 'Criar um endpoint REST API para autenticação de usuário',
      architecture: 'Criar um diagrama de arquitetura de microsserviços',
      sequence: 'Criar um diagrama de sequência para processamento de pagamento',
      state: 'Criar uma máquina de estados para status de pedido',
    },
  },
  
  // Modals
  modal: {
    delete: {
      title: 'Excluir Diagrama',
      message: 'Tem certeza de que deseja excluir "{title}"? Esta ação não pode ser desfeita.',
      confirm: 'Excluir',
      cancel: 'Cancelar',
    },
  },
} as const;
