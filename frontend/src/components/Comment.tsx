"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { formatDistanceToNowStrict } from "date-fns";
import { ArrowBigUp, MessageSquare, Trash2, CornerDownRight } from "lucide-react";
import NewCommentForm from "./NewCommentForm"; // We'll render the form directly

interface CommentProps {
  comment: any;
  users: any[];
  currentUser: any;
  onAddReply: (parentId: number, text: string) => void;
  onDelete: (id: number) => void;
  onUpvote: (commentId: number, hasUpvoted: boolean) => void;
  depth?: number;
}

export default function Comment({
  comment,
  users,
  currentUser,
  onAddReply,
  onDelete,
  onUpvote,
  depth = 0,
}: CommentProps) {
  const author = useMemo(() => users.find((u) => u.id === comment.user_id), [users, comment.user_id]);
  
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(true);
  const [isUpvoted, setIsUpvoted] = useState(false);

  const timeAgo = useMemo(() => {
    try {
      return formatDistanceToNowStrict(new Date(comment.created_at), { addSuffix: true });
    } catch { return "just now"; }
  }, [comment.created_at]);

  const isAuthor = currentUser?.id === comment.user_id;
  const canDelete = isAuthor || (currentUser && currentUser.isAdmin);

  const handleReplySubmit = () => {
    if (!replyText.trim() || !currentUser) return;
    onAddReply(comment.id, replyText.trim());
    setReplyText("");
    setIsReplying(false);
    setShowReplies(true);
  };

  const handleUpvoteClick = () => {
    onUpvote(comment.id, isUpvoted);
    setIsUpvoted((prev) => !prev);
  };

  const replies = comment.replies || [];
  const totalReplies = replies.length;
  
  // --- ADAPTIVE PADDING ---
  // We use a subtle indent that maxes out to save space
  const paddingLeft = depth > 0 ? `pl-4 sm:pl-6` : '';

  return (
    <div className={`relative ${paddingLeft}`}>
      {/* --- THREAD LINE --- */}
      {/* This vertical line connects a reply to its parent */}
      {depth > 0 && <div className="absolute left-0 top-0 h-full w-0.5 bg-[rgba(var(--border),0.5)] -translate-x-4 sm:-translate-x-5"></div>}
      
      <div className="relative flex gap-3 sm:gap-4">
        <Image
          src={author?.avatar || "https://i.pravatar.cc/150"}
          alt={author?.name || "User"}
          width={40}
          height={40}
          // The z-10 ensures the avatar sits on top of the thread line
          className="relative z-10 rounded-full h-8 w-8 sm:h-10 sm:w-10 mt-1 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="card p-3 sm:p-4 w-full">
            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-semibold text-sm text-[rgb(var(--text))] truncate">
                  {author?.name || "Unknown"}
                </span>
                <span className="text-xs text-muted flex-shrink-0">• {timeAgo}</span>
              </div>
              {canDelete && (
                <button onClick={() => confirm("Delete this comment?") && onDelete(comment.id)} className="hidden sm:flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 p-1 rounded-md">
                  <Trash2 size={14} /> <span className="hidden md:inline">Delete</span>
                </button>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed break-words">{comment.text}</p>
            <div className="mt-3 flex flex-wrap items-center gap-1 sm:gap-2">
              <button onClick={handleUpvoteClick} className={`flex items-center gap-1 text-sm font-semibold p-1 rounded-md transition-colors ${ isUpvoted ? "text-[rgb(var(--accent))]" : "text-muted hover:text-[rgb(var(--text))] hover:bg-[rgba(var(--border),0.5)]"}`}>
                <ArrowBigUp size={18} className={isUpvoted ? "fill-current" : ""} />
                {comment.upvotes}
              </button>
              <button onClick={() => setIsReplying((prev) => !prev)} className="flex items-center gap-1 text-xs font-semibold text-muted p-1 rounded-md hover:text-[rgb(var(--accent))] hover:bg-[rgba(var(--border),0.5)] transition-colors">
                <MessageSquare size={14} />
                {isReplying ? "Cancel" : "Reply"}
              </button>
              {canDelete && (
                <button onClick={() => confirm("Delete this comment?") && onDelete(comment.id)} className="flex sm:hidden items-center gap-1 text-xs font-semibold text-red-500 p-1 rounded-md">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {isReplying && (
               <NewCommentForm 
                  currentUser={currentUser}
                  newCommentText={replyText}
                  setNewCommentText={setReplyText}
                  onSubmit={handleReplySubmit}
                  isReply={true}
                />
            )}

            {totalReplies > 0 && (
              <div>
                <button onClick={() => setShowReplies((s) => !s)} className="flex items-center gap-2 text-xs font-semibold text-muted hover:text-[rgb(var(--accent))] mb-3">
                  <CornerDownRight size={14} />
                  {showReplies ? `Hide ${totalReplies} repl${totalReplies > 1 ? "ies" : "y"}` : `View ${totalReplies} repl${totalReplies > 1 ? "ies" : "y"}`}
                </button>
                {showReplies && (
                  <div className="space-y-4">
                      {replies.map((r: any) => (
                        <Comment
                          key={r.id}
                          comment={r}
                          users={users}
                          currentUser={currentUser}
                          onAddReply={onAddReply}
                          onDelete={onDelete}
                          onUpvote={onUpvote}
                          depth={depth + 1}
                        />
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}