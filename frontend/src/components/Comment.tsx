// components/Comment.tsx
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { formatDistanceToNowStrict } from "date-fns";
import { ArrowBigUp, MessageSquare, Trash2, CornerDownRight } from "lucide-react";

interface CommentProps {
  comment: any;
  users: any[];
  userId: string;
  onAddReply: (parentId: number, text: string) => void;
  onDelete: (id: number) => void;
  onUpvote: (commentId: number, hasUpvoted: boolean) => void;
  depth?: number;
}

export default function Comment({
  comment,
  users,
  userId,
  onAddReply,
  onDelete,
  onUpvote,
  depth = 0,
}: CommentProps) {
  const user = useMemo(
    () => users.find((u) => u.id === comment.user_id),
    [users, comment.user_id]
  );
  const currentUser = useMemo(
    () => users.find((u) => u.email === userId),
    [users, userId]
  );

  const [showReplies, setShowReplies] = useState(true);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isUpvoted, setIsUpvoted] = useState(false);

  const timeAgo = useMemo(() => {
    try {
      return formatDistanceToNowStrict(new Date(comment.created_at), {
        addSuffix: true,
      });
    } catch {
      return "just now";
    }
  }, [comment.created_at]);

  const isAuthor = userId === user?.email;
  const isAdmin = userId === "admin";
  const replies = Array.isArray(comment.replies) ? comment.replies : [];
  const totalReplies = replies.length;

  const handleReply = () => {
    if (!replyText.trim() || !currentUser) return;
    onAddReply(comment.id, replyText.trim());
    setReplyText("");
    setReplying(false);
    setShowReplies(true);
  };

  const handleUpvoteClick = () => {
    onUpvote(comment.id, isUpvoted);
    setIsUpvoted((s) => !s);
  };

  return (
    <div className="relative flex gap-2 sm:gap-3 w-full">
      {/* Avatar */}
      <div className="flex-shrink-0 z-10">
        <Image
          src={user?.avatar || "https://i.pravatar.cc/150"}
          alt={user?.name || "User"}
          width={depth > 0 ? 32 : 40}
          height={depth > 0 ? 32 : 40}
          className={`rounded-full ${depth > 0 ? "w-8 h-8 mt-1" : "w-10 h-10"}`}
        />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="card p-3 sm:p-4 border-l-2 border-transparent hover:border-[rgba(var(--accent),0.2)] w-full">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            {/* Name + Time */}
            <div
              className={`flex flex-col ${
                depth > 3 ? "items-start gap-0.5" : "sm:flex-row sm:items-center sm:gap-2"
              }`}
            >
              <span className="font-semibold text-sm text-[rgb(var(--text))]">
                {user?.name || "Unknown"}
              </span>
              <span
                className={`text-xs text-muted ${
                  depth > 3 ? "block sm:inline" : "inline"
                }`}
              >
                 • {timeAgo}
              </span>
            </div>

            {/* Delete (desktop only) */}
            {(isAdmin || isAuthor) && (
              <button
                onClick={() =>
                  confirm("Delete this comment?") && onDelete(comment.id)
                }
                className="hidden sm:flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-colors duration-200 px-2 py-1 rounded-md"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            )}
          </div>

          {/* Text */}
          <p className="mt-2 text-sm leading-relaxed break-words">{comment.text}</p>

          {/* --- Actions Row --- */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {/* Upvote */}
            <button
              onClick={handleUpvoteClick}
              className={`flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 px-2 py-1 rounded-md ${
                isUpvoted
                  ? "text-[rgb(var(--accent))]"
                  : "text-muted hover:text-[rgb(var(--text))] hover:bg-[rgba(var(--border),0.5)]"
              }`}
            >
              <ArrowBigUp
                size={18}
                className={isUpvoted ? "fill-[rgb(var(--accent))]" : ""}
              />
              {comment.upvotes}
            </button>

            {/* Reply */}
            <button
              onClick={() => setReplying((r) => !r)}
              className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-[rgb(var(--accent))] hover:bg-[rgba(var(--border),0.5)] transition-colors duration-200 px-2 py-1 rounded-md"
            >
              <MessageSquare size={14} />
              {replying ? "Cancel" : "Reply"}
            </button>

            {/* Delete (mobile only) */}
            {(isAdmin || isAuthor) && (
              <button
                onClick={() =>
                  confirm("Delete this comment?") && onDelete(comment.id)
                }
                className="flex sm:hidden items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-colors duration-200 px-2 py-1 rounded-md"
              >
                <Trash2 size={14} />
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Reply box */}
        {replying && (
          <div className="mt-3 flex items-start gap-2 sm:gap-3">
            <Image
              src={currentUser?.avatar || "https://i.pravatar.cc/150"}
              alt="You"
              width={32}
              height={32}
              className="rounded-full mt-1 flex-shrink-0 h-8 w-8"
            />
            <div className="flex-1">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="w-full resize-none text-sm"
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                  className="rounded-md btn-accent px-4 py-1.5 text-xs"
                >
                  Post Reply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Replies */}
        {totalReplies > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowReplies((s) => !s)}
              className="flex items-center gap-2 text-xs font-semibold text-muted hover:text-[rgb(var(--accent))] mb-3"
            >
              <CornerDownRight size={14} />
              {showReplies
                ? `Hide ${totalReplies} repl${
                    totalReplies > 1 ? "ies" : "y"
                  }`
                : `View ${totalReplies} repl${
                    totalReplies > 1 ? "ies" : "y"
                  }`}
            </button>

            {showReplies && (
              <div className="space-y-4">
                {replies.map((r: any) => (
                  <Comment
                    key={r.id}
                    comment={r}
                    users={users}
                    userId={userId}
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
  );
}