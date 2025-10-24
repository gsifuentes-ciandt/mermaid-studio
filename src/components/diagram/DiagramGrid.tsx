import { useState } from 'react';
import { useDiagramStore } from '@/store/diagramStore';
import { useProjectStore } from '@/store/projectStore';
import { DiagramCard } from './DiagramCard';
import { Pagination } from '@/components/ui/Pagination';
import { DiagramGridSkeleton } from '@/components/ui/Skeleton';

const ITEMS_PER_PAGE = 9; // 3 per row

interface DiagramGridProps {
  loading?: boolean;
}

export function DiagramGrid({ loading = false }: DiagramGridProps): JSX.Element {
  const filteredDiagrams = useDiagramStore((state) => state.filteredDiagrams());
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredDiagrams.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDiagrams = filteredDiagrams.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  // Show skeleton while loading
  if (loading) {
    return <DiagramGridSkeleton />;
  }

  if (filteredDiagrams.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-white/90 p-12 text-center shadow-lg backdrop-blur dark:bg-gray-800/90">
        <div className="text-6xl mb-6">📊</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2 dark:text-white">No diagrams found</h3>
        <p className="text-gray-600 dark:text-gray-400">
          {useDiagramStore.getState().diagrams.length === 0
            ? 'Create your first diagram to get started'
            : 'Try adjusting your search or filters'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
        {currentDiagrams.map((diagram, index) => (
          <DiagramCard key={`${diagram.name}-${index}`} diagram={diagram} />
        ))}
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
