// =====================================================
// PROJECT PAGE
// =====================================================
// View and manage a specific project with folders and diagrams

import { type ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { logger } from '../utils/logger';
import { useProjectStore } from '../store/projectStore';
import { useDiagramStore } from '../store/diagramStore';
import { useProjectPermissions } from '../hooks/useProjectPermissions';
import { useI18n } from '../contexts/I18nContext';
import toast from 'react-hot-toast';
import { FolderList } from '../components/folders/FolderList';
import { DiagramGrid } from '../components/diagram/DiagramGrid';
import { ProjectHeader } from '../components/projects/ProjectHeader';
import { ProjectSettingsModal } from '../components/projects/ProjectSettingsModal';
import { CreateFolderModal } from '../components/folders/CreateFolderModal';
import { EditFolderModal } from '../components/folders/EditFolderModal';
import { DeleteFolderModal } from '../components/folders/DeleteFolderModal';
import { ShareModal } from '../components/sharing/ShareModal';
import { ZoomModal } from '../components/zoom/ZoomModal';
import { InfoModal } from '../components/modals/InfoModal';
import { DiagramModal } from '../components/modals/DiagramModal';
import { Toolbar } from '../components/layout/Toolbar';
import { SearchFilterBar } from '../components/layout/SearchFilterBar';
import { MobileHeader } from '../components/layout/MobileHeader';
import { MobileDrawer } from '../components/layout/MobileDrawer';
import { CollapsibleSidebar } from '../components/layout/CollapsibleSidebar';
import { Button } from '../components/ui/Button';
import { Plus, Share2, FolderPlus, FileText, FolderOpen } from 'lucide-react';
import { isDemoMode, mockDiagrams } from '../services/demo.service';
import { fetchDiagramsByFolder, cloudDiagramToLocal } from '../services/diagram.service';
import { isSupabaseConfigured } from '../services/supabase';
import type { Diagram } from '../types/diagram.types';
import type { Folder } from '../types/collaboration.types';

export function ProjectPage(): ReactElement {
  const { t } = useI18n();
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject, fetchProject, folders, fetchFolders, currentFolder, setCurrentFolder, loading } = useProjectStore();
  const { diagrams, filteredDiagrams, addDiagramToStore, clearAll } = useDiagramStore();
  const permissions = useProjectPermissions();
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isEditFolderModalOpen, setIsEditFolderModalOpen] = useState(false);
  const [isDeleteFolderModalOpen, setIsDeleteFolderModalOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [parentFolderForNew, setParentFolderForNew] = useState<string | undefined>(undefined);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isFolderSidebarCollapsed, setIsFolderSidebarCollapsed] = useState(false);
  const [diagramsLoading, setDiagramsLoading] = useState(false);
  const demoMode = isDemoMode();

  // Load collapse state from localStorage
  useEffect(() => {
    const collapsed = localStorage.getItem('folderSidebarCollapsed') === 'true';
    setIsFolderSidebarCollapsed(collapsed);
  }, []);

  // Save collapse state to localStorage
  const toggleFolderSidebar = () => {
    const newState = !isFolderSidebarCollapsed;
    setIsFolderSidebarCollapsed(newState);
    localStorage.setItem('folderSidebarCollapsed', String(newState));
  };

  const handleEditFolder = (folder: Folder) => {
    setSelectedFolder(folder);
    setIsEditFolderModalOpen(true);
  };

  const handleDeleteFolder = (folder: Folder) => {
    setSelectedFolder(folder);
    setIsDeleteFolderModalOpen(true);
  };

  const handleAddSubfolder = (parentFolder: Folder) => {
    setParentFolderForNew(parentFolder.id);
    setIsCreateFolderModalOpen(true);
  };
  
  // Convert CloudDiagram to Diagram format for the grid
  const convertToLocalDiagram = (cloudDiagram: any): Diagram => ({
    name: cloudDiagram.id,
    title: cloudDiagram.title,
    description: cloudDiagram.description || '',
    code: cloudDiagram.code,
    type: cloudDiagram.type,
    tags: '',
    createdAt: cloudDiagram.created_at,
    updatedAt: cloudDiagram.updated_at,
    httpMethod: cloudDiagram.http_method,
    endpointPath: cloudDiagram.endpoint_path,
    workflowActors: cloudDiagram.workflow_actors,
    workflowTrigger: cloudDiagram.workflow_trigger,
  });
  
  // Load diagrams for current folder
  useEffect(() => {
    const loadDiagrams = async () => {
      if (!currentFolder) return;
      
      // Set loading state
      setDiagramsLoading(true);
      
      // Clear all diagrams first
      clearAll();
      
      try {
        if (demoMode) {
          // Demo mode: Load mock diagrams
          const mockDiagramsForFolder = mockDiagrams[currentFolder.id] || [];
          mockDiagramsForFolder.forEach(cloudDiagram => {
            const localDiagram = convertToLocalDiagram(cloudDiagram);
            addDiagramToStore(localDiagram); // Use addDiagramToStore (no Supabase save)
          });
        } else if (isSupabaseConfigured()) {
          // Collaboration mode: Load from Supabase
          const result = await fetchDiagramsByFolder(currentFolder.id);
          if (result.success && result.data) {
            result.data.forEach(cloudDiagram => {
              const localDiagram = cloudDiagramToLocal(cloudDiagram);
              addDiagramToStore(localDiagram); // Use addDiagramToStore (no Supabase save)
            });
          }
        }
      } finally {
        // Clear loading state after a small delay to show skeleton
        setTimeout(() => setDiagramsLoading(false), 300);
      }
    };
    
    loadDiagrams();
  }, [currentFolder, demoMode, addDiagramToStore, clearAll]);

  useEffect(() => {
    if (projectId) {
      logger.log('🔄 Switching to project:', projectId);
      
      // Clear current folder and diagrams when switching projects
      setCurrentFolder(null);
      clearAll();
      
      // Fetch project and folders, then auto-select
      const loadProject = async () => {
        try {
          await fetchProject(projectId);
          await fetchFolders(projectId);
          logger.log('✅ Project data loaded');
          
          // Auto-select first folder AFTER folders are loaded
          // Get fresh folders from store
          const currentFolders = useProjectStore.getState().folders;
          logger.log('🔄 Auto-selecting first folder...', { foldersCount: currentFolders.length });
          
          if (currentFolders.length > 0) {
            // Find first root folder (no parent)
            const firstRootFolder = currentFolders
              .filter(f => !f.parent_folder_id)
              .sort((a, b) => a.sort_order - b.sort_order)[0];
            
            const folderToSelect = firstRootFolder || currentFolders[0];
            logger.log('✅ Setting current folder:', folderToSelect.name);
            setCurrentFolder(folderToSelect);
          }
        } catch (error) {
          console.error('❌ Failed to load project:', error);
          toast.error('Failed to load project. You may not have access to this project.');
        }
      };
      
      loadProject();
    }
  }, [projectId, fetchProject, fetchFolders, clearAll, setCurrentFolder]);

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Desktop Header */}
      <div className="hidden lg:block">
        <ProjectHeader
          project={currentProject}
          onShare={() => setIsShareModalOpen(true)}
          onSettings={() => setIsSettingsModalOpen(true)}
        />
      </div>

      {/* Mobile Header */}
      <MobileHeader
        project={currentProject}
        onMenuClick={() => setIsMobileDrawerOpen(true)}
        onShare={() => setIsShareModalOpen(true)}
        onSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Folders Sidebar - Desktop with Collapse */}
        <div className="hidden lg:block">
          <CollapsibleSidebar
            isCollapsed={isFolderSidebarCollapsed}
            onToggle={toggleFolderSidebar}
            side="left"
            title={t('project.folders')}
            icon={FolderOpen}
          >
            <div className="p-2">
              <div className="flex items-center justify-between mb-4">
                {permissions.canCreateFolder && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCreateFolderModalOpen(true)}
                    className="ml-auto bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 p-2 h-8 w-8"
                  >
                    <FolderPlus className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                  </Button>
                )}
              </div>
              <FolderList 
                folders={folders} 
                loading={loading}
                onEdit={handleEditFolder}
                onDelete={handleDeleteFolder}
                onAddSubfolder={handleAddSubfolder}
              />
            </div>
          </CollapsibleSidebar>
        </div>

        {/* Diagrams Area */}
        <div className="flex-1 overflow-y-auto">
          {currentFolder ? (
            <div className="flex flex-col h-full">
              {/* Folder Header */}
              <div className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {currentFolder.name}
                </h2>
                {currentFolder.description && (
                  <p className="text-gray-600 dark:text-gray-300">
                    {currentFolder.description}
                  </p>
                )}
              </div>
              
              {/* Toolbar */}
              <div className="px-6 pt-4">
                <Toolbar />
              </div>
              
              {/* Search and Filter */}
              <div className="px-6 pt-4 pb-4">
                <SearchFilterBar />
              </div>
              
              {/* Diagram Grid */}
              <div className="flex-1 px-6 pb-6">
                <DiagramGrid loading={diagramsLoading} />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FolderPlus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('project.noFolders')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {t('project.noFoldersDesc')}
                </p>
                <Button onClick={() => setIsCreateFolderModalOpen(true)}>
                  <Plus className="h-5 w-5 mr-2" />
                  {t('project.createFolder')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        title="Folders"
      >
        <div className="p-4">
          {permissions.canCreateFolder && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setParentFolderForNew(undefined);
                setIsCreateFolderModalOpen(true);
              }}
              className="w-full mb-4"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              {t('project.newFolder')}
            </Button>
          )}
          <FolderList 
            folders={folders} 
            loading={loading}
            onEdit={handleEditFolder}
            onDelete={handleDeleteFolder}
            onAddSubfolder={handleAddSubfolder}
          />
        </div>
      </MobileDrawer>

      {/* Modals */}
      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => {
          setIsCreateFolderModalOpen(false);
          setParentFolderForNew(undefined);
        }}
        projectId={projectId!}
        parentFolderId={parentFolderForNew}
        onFolderCreated={(folder) => {
          // Auto-select the newly created folder
          setCurrentFolder(folder);
          setParentFolderForNew(undefined);
        }}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        project={currentProject}
      />
      <ProjectSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        project={currentProject}
      />
      <EditFolderModal
        isOpen={isEditFolderModalOpen}
        onClose={() => {
          setIsEditFolderModalOpen(false);
          setSelectedFolder(null);
        }}
        folder={selectedFolder}
      />
      <DeleteFolderModal
        isOpen={isDeleteFolderModalOpen}
        onClose={() => {
          setIsDeleteFolderModalOpen(false);
          setSelectedFolder(null);
        }}
        folder={selectedFolder}
      />
      <ZoomModal />
      <InfoModal />
      <DiagramModal />
    </div>
  );
}
