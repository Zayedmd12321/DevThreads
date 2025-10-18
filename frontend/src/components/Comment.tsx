"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { formatDistanceToNowStrict } from "date-fns";
import {
  ArrowBigUp,
  MessageSquare,
  Trash2,
  CornerDownRight,
} from "lucide-react";
import NewCommentForm from "./NewCommentForm"; // Make sure this component is updated as per our previous chat
import { CommentType, User } from "@/types/index";

const DESKTOP_DEPTH_LIMIT = 5;
const MOBILE_DEPTH_LIMIT = 2;

interface CommentProps {
  comment: CommentType;
  users: User[];
  currentUser: User|null;
  onAddReply: (parentId: number | null, text: string) => void;
  onDelete: (id: number) => void;
  onUpvote: (commentId: number, hasUpvoted: boolean) => void;
  depth?: number;
  isFocusedThread?: boolean;
  onViewThread?: (commentId: number) => void;
}


export default function Comment({
  comment,
  users,
  currentUser,
  onAddReply,
  onDelete,
  onUpvote,
  depth = 0,
  isFocusedThread = false,
  onViewThread,
}: CommentProps) {
  const author = useMemo(
    () => users.find((u) => u.id === comment.user_id),
    [users, comment.user_id]
  );

  const [isReplying, setIsReplying] = useState(false);
  // REMOVED: const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(true);
  // REMOVED: const [isUpvoted, setIsUpvoted] = useState(comment.hasUpvoted || false);
  const [isMobile, setIsMobile] = useState(false);

  // --- DERIVED STATE: Read directly from props ---
  // This is now the single source of truth.
  const isUpvoted = comment.hasUpvoted || false;

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const timeAgo = useMemo(() => {
    try {
      return formatDistanceToNowStrict(new Date(comment.created_at), {
        addSuffix: true,
      });
    } catch {
      return "just now";
    }
  }, [comment.created_at]);

  const isAuthor = currentUser?.id === comment.user_id;
  const canDelete = isAuthor || (currentUser && currentUser.isAdmin);

  // UPDATED: This handler now receives the text from the (fixed) NewCommentForm
  const handleReplySubmit = (text: string) => {
    if (!text.trim() || !currentUser) return;
    onAddReply(comment.id, text.trim());
    // setReplyText(""); // No longer needed
    setIsReplying(false);
    setShowReplies(true);
  };

  // UPDATED: This handler ONLY tells the parent what happened.
  // It does not set any local state.
  const handleUpvoteClick = () => {
    onUpvote(comment.id, isUpvoted);
    // REMOVED: comment.upvotes += 1; (This was a prop mutation bug)
    // REMOVED: setIsUpvoted((prev: any) => !prev);
  };

  const replies = comment.replies || [];
  const totalReplies = replies.length;
  const depthLimit = isMobile ? MOBILE_DEPTH_LIMIT : DESKTOP_DEPTH_LIMIT;

  const renderReplies = (isFocused: boolean) => (
    <div className={`space-y-4 ${isFocused ? "pt-4" : ""}`}>
      {replies.map((r) => (
        <Comment
          key={r.id}
          comment={r}
          users={users}
          currentUser={currentUser}
          onAddReply={onAddReply}
          onDelete={onDelete}
          onUpvote={onUpvote}
          depth={depth + 1}
          isFocusedThread={isFocused}
          onViewThread={onViewThread}
        />
      ))}
    </div>
  );

  return (
    <div className="relative">
      {/* ... Thread connector ... */}
      {replies?.length > 0 && (
        <div
          className={`
            absolute 
            left-[18px]
            top-[44px] bottom-0
            w-[1.5px]
            bg-gradient-to-b 
            from-transparent 
            via-[rgba(160,160,160,0.4)] 
            to-[rgba(160,160,160,0.08)]
            rounded-full
            animate-threadGrow
            pointer-events-none
          `}
          style={{ animationDelay: `${depth * 80}ms` }}
        ></div>
      )}

      {/* 💬 Comment body */}
      <div className="relative flex gap-[3px] sm:gap-4">
        <Image
          src={author?.avatar || "https://i.pravatar.cc/150"}
          alt={author?.name || "User"}
          width={40}
          height={40}
          className="relative z-10 rounded-full h-8 w-8 sm:h-10 sm:w-10 mt-1 flex-shrink-0 object-cover"
        />

        <div className="flex-1 min-w-0">
          <div className="card p-3 sm:p-4 w-full">
            {/* ... Card header ... */}
            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-semibold text-sm text-[rgb(var(--text))] truncate">
                  {author?.name || "Unknown"}
                </span>
                <span className="text-xs text-muted flex-shrink-0">
                  • {timeAgo}
                </span>
              </div>
              {canDelete && (
                <button
                  onClick={() =>
                    confirm("Delete this comment?") && onDelete(comment.id)
                  }
                  className="hidden sm:flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 p-1 rounded-md cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span className="hidden md:inline">Delete</span>
                </button>
              )}
            </div>

            <p className="text-sm leading-relaxed break-words">
              {comment.text}
            </p>

            {/* ... Card actions ... */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <button
                onClick={handleUpvoteClick}
                className={`flex items-center gap-[1px] text-sm font-semibold p-1 rounded-md transition-colors cursor-pointer actionbtn ${
                  isUpvoted // Now reads directly from the prop
                    ? "text-[rgb(var(--accent))] actionbtn2"
                    : "text-muted"
                }`}
              >
                <ArrowBigUp
                  size={18}
                  className={isUpvoted ? "fill-current" : ""}
                />
                {comment.upvotes}
              </button>
              {/* ... other buttons ... */}
               <button
                onClick={() => setIsReplying((prev) => !prev)}
                className="flex items-center gap-1 text-xs font-semibold text-muted p-1 rounded-md cursor-pointer actionbtn"
              >
                <MessageSquare size={14} />
                {totalReplies}
              </button>

              {canDelete && (
                <button
                  onClick={() =>
                    confirm("Delete this comment?") && onDelete(comment.id)
                  }
                  className="flex sm:hidden items-center gap-1 text-xs font-semibold text-red-500 p-1 rounded-md cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {isReplying && (
              <NewCommentForm
                currentUser={currentUser}
                // REMOVED: newCommentText={replyText}
                // REMOVED: setNewCommentText={setReplyText}
                onSubmit={handleReplySubmit} // UPDATED
                isReply={true}
              />
            )}

            {/* ... Replies logic (unchanged) ... */}
            {totalReplies > 0 &&
              (() => {
                if (isFocusedThread) {
                  if (depth < depthLimit) {
                    return renderReplies(true);
                  } else if (onViewThread) {
                    return (
                      <button
                        onClick={() => onViewThread(comment.id)}
                        className="flex items-center gap-2 text-xs font-semibold text-muted hover:text-[rgb(var(--accent))] mt-3 cursor-pointer p-1 rounded-md actionbtn"
                      >
                        <CornerDownRight size={14} />
                        {`View full thread (${totalReplies} repl${
                          totalReplies > 1 ? "ies" : "y"
                        })`}
                      </button>
                    );
                  }
                  return null;
                }

                if (depth < depthLimit) {
                  return (
                    <>
                      <button
                        onClick={() => setShowReplies((s) => !s)}
                        className="flex items-center gap-2 text-xs font-semibold text-muted hover:text-[rgb(var(--accent))] mb-3 p-1 rounded-md cursor-pointer actionbtn"
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
                      {showReplies && renderReplies(false)}
                    </>
                  );
                }

                if (onViewThread) {
                  return (
                    <button
                      onClick={() => onViewThread(comment.id)}
                      className="flex items-center gap-2 text-xs font-semibold text-muted hover:text-[rgb(var(--accent))] mt-3 cursor-pointer p-1 rounded-md hover:bg-[rgba(var(--border),0.3)] transition-colors"
                    >
                      <CornerDownRight size={14} />
                      {`View full thread (${totalReplies} repl${
                        totalReplies > 1 ? "ies" : "y"
                      })`}
                    </button>
                  );
                }

                return null;
              })()}
          </div>
        </div>
      </div>
    </div>
  );
}