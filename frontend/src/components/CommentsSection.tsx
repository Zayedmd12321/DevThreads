// components/CommentsSection.tsx
import Comment from "@/components/Comment";
import { ChevronDown } from "lucide-react";

interface CommentsSectionProps {
  totalComments: number;
  sortType: string;
  setSortType: (type: string) => void;
  comments: any[];
  users: any[];
  userId: string;
  onAddReply: (parentId: number, text: string) => void;
  onDelete: (id: number) => void;
  onUpvote: (commentId: number, hasUpvoted: boolean) => void;
  currentUser: any;
}

export default function CommentsSection({
  totalComments,
  sortType,
  setSortType,
  comments,
  users,
  userId,
  onAddReply,
  onDelete,
  onUpvote,
  currentUser
}: CommentsSectionProps) {
  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <h2 className="text-xl font-bold">{totalComments} Comments</h2>
        <div className="relative">
          <select 
            value={sortType} 
            onChange={(e) => setSortType(e.target.value)} 
            className="cursor-pointer appearance-none rounded-md py-2 pl-4 pr-10 text-sm font-medium bg-[rgb(var(--surface))] border border-[rgb(var(--border))] transition-colors hover:bg-[rgba(var(--border),0.5)]"
          >
            <option value="newest">Newest First</option>
            <option value="most-upvoted">Most Upvoted</option>
            <option value="oldest">Oldest First</option>
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
        </div>
      </div>

      <div className="space-y-6">
        {comments.map(c => (
          <Comment 
            key={c.id} 
            comment={c} 
            users={users} 
            currentUser={currentUser}
            onAddReply={onAddReply} 
            onDelete={onDelete} 
            onUpvote={onUpvote} 
          />
        ))}
      </div>
    </div>
  );
}