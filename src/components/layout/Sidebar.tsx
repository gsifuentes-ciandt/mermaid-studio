// =====================================================
// SIDEBAR
// =====================================================
// Navigation sidebar with projects

import { type ReactElement, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProjectStore } from '../../store/projectStore';
import { useUIStore } from '../../store/uiStore';
import { Button } from '../ui/Button';
import { LayoutDashboard, Settings, Plus, GripVertical, Briefcase } from 'lucide-react';

export function Sidebar(): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const { openProjectModal } = useUIStore();
  const { projects, fetchProjects } = useProjectStore();
  const [draggedProject, setDraggedProject] = useState<string | null>(null);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const isActive = (path: string) => location.pathname === path;

  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('projectId', projectId);
    setDraggedProject(projectId);
  };

  const handleDragOver = (e: React.DragEvent, projectId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOver(projectId);
  };

  const handleDragLeave = () => {
    setDraggedOver(null);
  };

  const handleDrop = async (e: React.DragEvent, targetProjectId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('projectId');
    
    if (draggedId && draggedId !== targetProjectId) {
      // Find indices
      const draggedIndex = projects.findIndex(p => p.id === draggedId);
      const targetIndex = projects.findIndex(p => p.id === targetProjectId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        // Reorder locally
        const newProjects = [...projects];
        const [removed] = newProjects.splice(draggedIndex, 1);
        newProjects.splice(targetIndex, 0, removed);
        
        // Update store (optimistic update)
        useProjectStore.setState({ projects: newProjects });
        
        // TODO: Update sort_order in database
        console.log('Projects reordered:', newProjects.map(p => p.name));
      }
    }
    
    setDraggedProject(null);
    setDraggedOver(null);
  };

  const handleDragEnd = () => {
    setDraggedProject(null);
    setDraggedOver(null);
  };

  return (
    <aside className="hidden lg:flex w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col">
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <button
          onClick={() => navigate('/dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            isActive('/dashboard')
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="font-medium">Dashboard</span>
        </button>

        <button
          onClick={() => navigate('/settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            isActive('/settings')
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span className="font-medium">Settings</span>
        </button>

        {/* Projects Section */}
        <div className="pt-6">
          <div className="flex items-center justify-between px-3 mb-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Projects
            </h3>
            <button
              onClick={() => openProjectModal()}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Create New Project"
            >
              <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="space-y-1">
            {projects.slice(0, 10).map((project) => (
              <div
                key={project.id}
                draggable
                onDragStart={(e) => handleDragStart(e, project.id)}
                onDragOver={(e) => handleDragOver(e, project.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, project.id)}
                onDragEnd={handleDragEnd}
                className={`
                  group relative rounded-lg transition-all
                  ${draggedProject === project.id ? 'opacity-50 cursor-grabbing' : 'cursor-grab'}
                  ${draggedOver === project.id ? 'mt-8' : ''}
                `}
              >
                {/* Drop Indicator Line */}
                {draggedOver === project.id && draggedProject !== project.id && (
                  <div className="absolute -top-1 left-0 right-0 h-0.5 bg-primary-500 rounded-full shadow-lg shadow-primary-500/50" />
                )}
                <button
                  onClick={() => navigate(`/project/${project.id}`)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === `/project/${project.id}`
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <GripVertical className="h-4 w-4 flex-shrink-0 opacity-0 group-hover:opacity-50 cursor-grab active:cursor-grabbing" />
                  <Briefcase className="h-5 w-5 flex-shrink-0" />
                  <span className="flex-1 truncate text-sm">{project.name}</span>
                </button>
              </div>
            ))}
          </div>

          {projects.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 px-3 py-2">
              No projects yet
            </p>
          )}
        </div>
      </nav>
    </aside>
  );
}
