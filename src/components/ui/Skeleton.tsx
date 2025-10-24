// =====================================================
// SKELETON COMPONENT
// =====================================================
// Loading placeholder with shimmer animation

import { type ReactElement } from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps): ReactElement {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
        className
      )}
    />
  );
}

// Folder Skeleton
export function FolderSkeleton(): ReactElement {
  return (
    <div className="space-y-2 px-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2 py-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  );
}

// Diagram Card Skeleton
export function DiagramCardSkeleton(): ReactElement {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
      <div className="flex items-start justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-32 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );
}

// Diagram Grid Skeleton
export function DiagramGridSkeleton(): ReactElement {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <DiagramCardSkeleton key={i} />
      ))}
    </div>
  );
}

// User Preferences Skeleton
export function UserPreferencesSkeleton(): ReactElement {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

// Project List Skeleton
export function ProjectListSkeleton(): ReactElement {
  return (
    <div className="space-y-2 px-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-2 py-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  );
}

// Project Card Skeleton
export function ProjectCardSkeleton(): ReactElement {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-2 border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mt-1" />
        </div>
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-24" />
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

// Project Grid Skeleton
export function ProjectGridSkeleton(): ReactElement {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}
