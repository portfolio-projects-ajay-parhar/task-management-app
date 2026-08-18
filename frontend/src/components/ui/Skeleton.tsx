interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className = "" }: SkeletonProps) => (
  <div
    className={`animate-pulse rounded bg-gray-100 dark:bg-gray-800 ${className}`}
    aria-hidden
  />
);

export const StatsCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
    <Skeleton className="h-8 w-12 mb-2" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

export const TaskCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
    <div className="flex items-start justify-between gap-3 mb-3">
      <Skeleton className="h-5 w-3/5" />
      <Skeleton className="h-6 w-10 rounded-lg" />
    </div>
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-4/5 mb-4" />
    <div className="flex gap-2 mb-4">
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-5 w-14 rounded-full" />
    </div>
    <div className="flex items-center justify-between">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3 w-16" />
    </div>
  </div>
);
