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
  
  // Collaboration Features
  dashboard: {
    title: 'Meus Projetos',
    subtitle: 'Gerencie e organize seus projetos de diagramas',
    newProject: 'Novo Projeto',
    noProjects: 'Ainda não há projetos',
    noProjectsDesc: 'Crie seu primeiro projeto para começar',
    createFirst: 'Crie Seu Primeiro Projeto',
    loading: 'Carregando projetos...',
    projectCount: '{count} projeto(s)',
  },
  
  project: {
    backToDashboard: 'Voltar ao Painel',
    share: 'Compartilhar',
    settings: 'Configurações',
    newFolder: 'Nova Pasta',
    addFolder: 'Adicionar Pasta',
    folders: 'Pastas',
    noFolders: 'Ainda não há pastas',
    noFoldersDesc: 'Crie pastas para organizar seus diagramas',
    createFolder: 'Criar Pasta',
    noDiagrams: 'Não há diagramas nesta pasta',
    noDiagramsDesc: 'Adicione seu primeiro diagrama para começar',
    addDiagram: 'Adicionar Diagrama',
    loading: 'Carregando projeto...',
    folderCount: '{count} pasta(s)',
    diagramCount: '{count} diagrama(s)',
  },
  
  share: {
    title: 'Compartilhar Projeto',
    invitePeople: 'Convidar Pessoas',
    emailPlaceholder: 'Digite o endereço de e-mail',
    selectRole: 'Selecionar função',
    addMember: 'Adicionar Membro',
    teamMembers: 'Membros da Equipe',
    you: 'Você',
    owner: 'Proprietário',
    admin: 'Administrador',
    editor: 'Editor',
    viewer: 'Visualizador',
    changeRole: 'Alterar Função',
    remove: 'Remover',
    shareLink: 'Link de Compartilhamento',
    copyLink: 'Copiar Link',
    linkCopied: 'Link copiado para a área de transferência!',
    close: 'Fechar',
    inviteSuccess: 'Usuário convidado com sucesso!',
    inviteError: 'Falha ao convidar usuário',
    userNotFound: 'Usuário não encontrado. Ele precisa se cadastrar primeiro.',
    removeSuccess: 'Membro removido com sucesso!',
    removeError: 'Falha ao remover membro',
    roleUpdateSuccess: 'Função atualizada com sucesso!',
    roleUpdateError: 'Falha ao atualizar função',
    memberCount: '{count} membro(s)',
  },
  
  projectSettings: {
    title: 'Configurações do Projeto',
    settings: 'Configurações',
    projectName: 'Nome do Projeto',
    projectNamePlaceholder: 'Digite o nome do projeto',
    description: 'Descrição',
    descriptionPlaceholder: 'Digite a descrição do projeto',
    visibility: 'Visibilidade',
    private: 'Privado',
    team: 'Equipe',
    dangerZone: 'Zona de Perigo',
    deleteProject: 'Excluir Projeto',
    deleteWarning: 'Esta ação não pode ser desfeita. Todos os diagramas e pastas serão excluídos permanentemente.',
    deleteButton: 'Excluir Projeto',
    cancel: 'Cancelar',
    save: 'Salvar Alterações',
    saveSuccess: 'Projeto atualizado com sucesso!',
    saveError: 'Falha ao atualizar projeto',
    deleteSuccess: 'Projeto excluído com sucesso!',
    deleteError: 'Falha ao excluir projeto',
  },
  
  userMenu: {
    signIn: 'Entrar com Google',
    signOut: 'Sair',
    preferences: 'Preferências',
    settings: 'Configurações',
    profile: 'Perfil',
    signInSuccess: 'Login realizado com sucesso!',
    signInError: 'Falha ao fazer login',
    signOutSuccess: 'Logout realizado com sucesso!',
    signOutError: 'Falha ao fazer logout',
  },
  
  folder: {
    createTitle: 'Criar Pasta',
    editTitle: 'Editar Pasta',
    folderName: 'Nome da Pasta',
    folderNamePlaceholder: 'Digite o nome da pasta',
    description: 'Descrição',
    descriptionPlaceholder: 'Digite a descrição da pasta (opcional)',
    parentFolder: 'Pasta Pai',
    selectParent: 'Selecionar pasta pai',
    rootLevel: 'Nível Raiz',
    cancel: 'Cancelar',
    create: 'Criar Pasta',
    save: 'Salvar Alterações',
    delete: 'Excluir Pasta',
    deleteWarning: 'Tem certeza de que deseja excluir esta pasta?',
    deleteWithDiagrams: 'Esta pasta contém {count} diagrama(s). Digite o nome da pasta para confirmar a exclusão:',
    confirmPlaceholder: 'Digite o nome da pasta para confirmar',
    createSuccess: 'Pasta criada com sucesso!',
    createError: 'Falha ao criar pasta',
    updateSuccess: 'Pasta atualizada com sucesso!',
    updateError: 'Falha ao atualizar pasta',
    deleteSuccess: 'Pasta excluída com sucesso!',
    deleteError: 'Falha ao excluir pasta',
    addSubfolder: 'Adicionar Subpasta',
    edit: 'Editar',
  },
  
  settings: {
    title: 'Configurações',
    subtitle: 'Gerencie sua conta, preferências e configuração de IA',
    profile: 'Perfil',
    aiConfig: 'Configuração de IA',
    preferences: 'Preferências',
    account: 'Conta',
    
    // Profile
    profileTitle: 'Informações do Perfil',
    profileSubtitle: 'Suas informações de perfil são gerenciadas pela sua conta do Google.',
    fullName: 'Nome Completo',
    email: 'E-mail',
    avatar: 'Avatar',
    profileNote: 'Para atualizar suas informações de perfil, visite as configurações da sua conta do Google.',
    
    // AI Config
    aiConfigTitle: 'Configuração de IA',
    aiConfigSubtitle: 'Configure seu provedor de IA e credenciais para geração de diagramas.',
    aiProvider: 'Provedor de IA',
    apiUrl: 'URL da API',
    clientId: 'ID do Cliente',
    clientSecret: 'Segredo do Cliente',
    tenant: 'Inquilino',
    agent: 'Agente',
    apiKey: 'Chave de API',
    saveConfig: 'Salvar Configuração',
    credentialsEncrypted: '🔒 As credenciais são criptografadas antes do armazenamento',
    saving: 'Salvando...',
    loading: 'Carregando...',
    
    // Preferences
    preferencesTitle: 'Preferências',
    preferencesSubtitle: 'Personalize sua experiência com configurações de tema e idioma.',
    theme: 'Tema',
    light: 'Claro',
    dark: 'Escuro',
    language: 'Idioma',
    savePreferences: 'Salvar Preferências',
    
    // Account
    accountTitle: 'Gerenciamento de Conta',
    accountSubtitle: 'Gerencie as configurações e dados da sua conta.',
    signOut: 'Sair',
    signOutDesc: 'Saia da sua conta neste dispositivo.',
    deleteAccount: 'Excluir Conta',
    deleteAccountWarning: 'Excluir permanentemente sua conta e todos os dados associados. Esta ação não pode ser desfeita.',
    
    // Toast messages
    saveSuccess: 'Configurações salvas com sucesso!',
    saveError: 'Falha ao salvar configurações',
    configSaveSuccess: 'Configuração de IA salva com sucesso',
    configSaveError: 'Falha ao salvar',
    prefSaveSuccess: 'Preferências salvas com sucesso',
    prefSaveError: 'Falha ao salvar preferências',
    mustBeLoggedIn: 'Você deve estar logado para salvar preferências',
    loadCredentialsError: 'Falha ao carregar credenciais',
  },
} as const;
