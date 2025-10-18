import CommentSkeleton from "./CommentSkeleton";
import PostCardSkeleton from "./PostCardSkeleton";

export default function PageSkeleton() {
  return (
    <div className="flex flex-col xl:flex-row gap-8 lg:gap-12">
      {/* Left Column: Post Card Skeleton */}
      <div className="w-full xl:w-2/5 mt-5">
        <PostCardSkeleton />
      </div>

      {/* Right Column: Comments Section Skeleton */}
      <div className="w-full xl:w-3/5 py-8">
        {/* New Comment Form Skeleton */}
        <div className="flex gap-4 animate-pulse mb-6">
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-10 flex-1 rounded-md bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Comments Header Skeleton */}
        <div className="flex justify-between items-center mb-4 animate-pulse">
          <div className="h-6 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-6 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* List of Comment Skeletons */}
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <CommentSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}