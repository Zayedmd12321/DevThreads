export default function PostCardSkeleton() {
  return (
    <div className="card p-5 sm:p-6 animate-pulse">
      {/* Author Info Placeholder */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-3 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>

      {/* Title Placeholder */}
      <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700 mb-4"></div>
      
      {/* --- MODIFICATION START --- */}
      {/* Image Placeholder */}
      <div className="w-full h-48 rounded-lg bg-gray-200 dark:bg-gray-700 mb-4"></div>
      {/* --- MODIFICATION END --- */}

      {/* Content Placeholder */}
      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>

      {/* Tags Placeholder */}
      <div className="mt-6 flex items-center gap-2">
        <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-6 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>

      {/* Footer/Meta Placeholder */}
      <div className="mt-5 border-t border-gray-200 dark:border-gray-700 pt-4">
         <div className="h-5 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  );
}

