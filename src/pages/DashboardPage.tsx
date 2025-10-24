// =====================================================
// DASHBOARD PAGE
// =====================================================
// Main dashboard showing user's projects

import { type ReactElement, useEffect, useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { ProjectCard } from '../components/projects/ProjectCard';
import { CreateProjectModal } from '../components/projects/CreateProjectModal';
import { ProjectSettingsModal } from '../components/projects/ProjectSettingsModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { ProjectGridSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { Plus, FolderOpen } from 'lucide-react';
import type { Project } from '../types/collaboration.types';
import toast from 'react-hot-toast';
import { useI18n } from '../contexts/I18nContext';

export function DashboardPage(): ReactElement {
  const { t } = useI18n();
  const { projects, loading, fetchProjects, deleteProject } = useProjectStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSettings = (project: Project) => {
    setSelectedProject(project);
    setIsSettingsModalOpen(true);
  };

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedProject) {
      try {
        await deleteProject(selectedProject.id);
        toast.success(t('projectSettings.deleteSuccess'));
        setIsDeleteModalOpen(false);
        setSelectedProject(null);
      } catch (error) {
        toast.error(t('projectSettings.deleteError'));
        console.error(error);
      }
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('dashboard.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Create Project Button */}
      <div className="mb-6">
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          {t('dashboard.newProject')}
        </Button>
      </div>

      {/* Loading State */}
      {loading && projects.length === 0 && (
        <ProjectGridSkeleton />
      )}

      {/* Empty State */}
      {!loading && projects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('dashboard.noProjects')}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('dashboard.noProjectsDesc')}
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            {t('dashboard.createFirst')}
          </Button>
        </div>
      )}

      {/* Projects Grid */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project}
              onSettings={handleSettings}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Project Settings Modal */}
      {selectedProject && (
        <ProjectSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => {
            setIsSettingsModalOpen(false);
            setSelectedProject(null);
          }}
          project={selectedProject}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProject(null);
        }}
        onConfirm={confirmDelete}
        title={t('projectSettings.deleteProject')}
        message={`${t('projectSettings.deleteWarning')} "${selectedProject?.name}"`}
        confirmText={t('projectSettings.deleteButton')}
        variant="danger"
      />
    </div>
  );
}
