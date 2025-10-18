"use client";

import { useState, useEffect, useMemo } from "react";
import Comment from "@/components/Comment";
import { ArrowLeft } from "lucide-react";
import { CommentType, User } from "@/types/index";

interface FocusedThreadViewProps {
  parentComment: CommentType;
  users: User[];
  currentUser: User|null;
  onBack: () => void;
  onAddReply: (parentId: number | null, text: string) => void;
  onDelete: (id: number) => void;
  onUpvote: (commentId: number, hasUpvoted: boolean) => void;
}

function findCommentById(comment: CommentType, id: number): CommentType | null {
  if (comment.id === id) return comment;
  for (const reply of comment.replies || []) {
    const found = findCommentById(reply, id);
    if (found) return found;
  }
  return null;
}

export default function FocusedThreadView({
  parentComment,
  users,
  currentUser,
  onBack,
  onAddReply,
  onDelete,
  onUpvote,
}: FocusedThreadViewProps) {
  const [localFocusedComment, setLocalFocusedComment] = useState(parentComment);
  const [historyStack, setHistoryStack] = useState<CommentType[]>([]);

  const author = useMemo(
    () => users.find((u) => u.id === parentComment.user_id),
    [users, parentComment.user_id]
  );

  useEffect(() => {
    setLocalFocusedComment(parentComment);
    setHistoryStack([]);
  }, [parentComment]);

  const handleViewThread = (commentId: number) => {
    const found = findCommentById(localFocusedComment, commentId);
    if (found) {
      setHistoryStack((prev) => [...prev, localFocusedComment]);
      setLocalFocusedComment(found);
    }
  };

  const handleGoBackOneLevel = () => {
    setHistoryStack((prev) => {
      if (prev.length === 0) return prev;
      const newStack = [...prev];
      const previous = newStack.pop();
      setLocalFocusedComment(previous || parentComment);
      return newStack;
    });
  };

  return (
    <div className="card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-semibold text-sm text-muted cursor-pointer actionbtn  "
        >
          <ArrowLeft size={18} />
          Back to all comments
        </button>

        {historyStack.length > 0 && (
          <button
            onClick={handleGoBackOneLevel}
            className="text-xs font-semibold text-muted cursor-pointer actionbtn"
          >
            Back up one level
          </button>
        )}
      </div>

      <h3 className="text-sm font-bold text-muted uppercase tracking-wider">
        {author ? `Conversation with ${author.name}` : "Conversation Thread"}
      </h3>

      <div className="space-y-4">
        <Comment
          key={localFocusedComment.id}
          comment={localFocusedComment}
          users={users}
          currentUser={currentUser}
          onAddReply={onAddReply}
          onDelete={onDelete}
          onUpvote={onUpvote}
          isFocusedThread={true}
          onViewThread={handleViewThread}
          depth={0}
        />
      </div>
    </div>
  );
}
