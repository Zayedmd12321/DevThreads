export default function CommentSkeleton() {
  return (
    <div className="relative flex animate-pulse gap-3 sm:gap-4 py-2">
      {/* Avatar Placeholder */}
      <div className="h-8 w-8 sm:h-10 sm:w-10 mt-1 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700"></div>

      <div className="flex-1 min-w-0">
        <div className="w-full">
          {/* Header Placeholder (Name & Timestamp) */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-3 w-1/6 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>

          {/* Text Placeholder */}
          <div className="mt-3 space-y-2">
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>

          {/* Action Buttons Placeholder */}
          <div className="mt-4 flex items-center gap-4">
            <div className="h-5 w-10 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-5 w-10 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
}