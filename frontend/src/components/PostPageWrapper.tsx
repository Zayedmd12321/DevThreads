"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import NewCommentForm from "@/components/NewCommentForm";
import CommentsSection from "@/components/CommentsSection";
import FocusedThreadView from "@/components/FocusedThreadView";
import PageSkeleton from "./skeletons/PageSkeleton";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function PostPageWrapper() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [sortType, setSortType] = useState("newest");
  const [newCommentText, setNewCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [focusedComment, setFocusedComment] = useState<any | null>(null);

  const getAuthHeaders = useCallback((): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (userInfo && userInfo.token) {
      headers['Authorization'] = `Bearer ${userInfo.token}`;
    }
    return headers;
  }, []);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/comments`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
    if (!userInfo) {
      router.push("/login");
      return;
    }
    setCurrentUser(userInfo);

    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [usersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/users`),
          fetchComments()
        ]);
        if (!usersRes.ok) throw new Error('Failed to fetch users');
        const usersData = await usersRes.json();
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [router, fetchComments]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleAddComment = async (parentId: number | null, text: string) => {
    if (!text.trim() || !currentUser) return;

    // 1. Create a temporary comment for an instant UI update
    const tempId = `temp-${Date.now()}`;
    const newCommentOptimistic = {
      id: tempId,
      text: text.trim(),
      user_id: currentUser.id,
      parent_id: parentId,
      created_at: new Date().toISOString(),
      upvotes: 0,
      replies: [],
      // You can add any other necessary fields with default values
    };

    // 2. Add the optimistic comment to the UI
    // This helper function finds the right place to add the reply
    const addCommentToState = (list: any[], comment: any): any[] => {
      if (comment.parent_id === null) {
        return [comment, ...list];
      }
      return list.map(c => {
        if (c.id === comment.parent_id) {
          return { ...c, replies: [comment, ...(c.replies || [])] };
        }
        if (c.replies && c.replies.length > 0) {
          return { ...c, replies: addCommentToState(c.replies, comment) };
        }
        return c;
      });
    };

    setComments(prevComments => addCommentToState(prevComments, newCommentOptimistic));
    setNewCommentText(""); // Clear input immediately

    try {
      // 3. Send the actual request to the server
      const res = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          text: text.trim(),
          user_id: currentUser.id,
          parent_id: parentId,
        }),
      });

      if (!res.ok) throw new Error('Failed to post comment');

      // 4. On success, refetch all comments to sync with the server
      // This will replace the temp comment with the real one
      await fetchComments();

      // If in focused view, update it as well
      if (parentId && focusedComment) {
        const newCommentsList = await (await fetch(`${API_BASE_URL}/comments`)).json();
        const updatedParent = findCommentById(focusedComment.id, newCommentsList);
        setFocusedComment(updatedParent);
      }

    } catch (error) {
      console.error(error);
      // 5. If it fails, remove the optimistic comment
      alert("Failed to post comment. Please try again.");
      setComments(prevComments => prevComments.filter(c => c.id !== tempId));
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete comment');
      if (focusedComment && focusedComment.id === commentId) {
        setFocusedComment(null);
      }
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpvote = async (commentId: number, hasUpvoted: boolean) => {
    try {
      const res = await fetch(`${API_BASE_URL}/comments/${commentId}/upvote`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ hasUpvoted }),
      });
      if (!res.ok) throw new Error('Failed to upvote comment');
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  const sortedComments = useMemo(() => {
    const sortRec = (list: any[]): any[] => {
      if (!Array.isArray(list)) return [];
      const arr = [...list];
      if (sortType === "most-upvoted") arr.sort((a, b) => b.upvotes - a.upvotes);
      else if (sortType === "newest") arr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      else if (sortType === "oldest") arr.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      return arr.map(c => ({ ...c, replies: sortRec(c.replies || []) }));
    };
    return sortRec(comments);
  }, [comments, sortType]);

  const totalComments = useMemo(() => {
    const count = (list: any[]): number => {
      if (!Array.isArray(list)) return 0;
      return list.length + list.reduce((s, c) => s + count(c.replies || []), 0);
    };
    return count(comments);
  }, [comments]);

  const findCommentById = (id: number, commentList: any[]): any | null => {
    for (const comment of commentList) {
      if (comment.id === id) return comment;
      if (comment.replies) {
        const found = findCommentById(id, comment.replies);
        if (found) return found;
      }
    }
    return null;
  };

  const handleViewThread = (commentId: number) => {
    const comment = findCommentById(commentId, comments);
    setFocusedComment(comment);
  };

  const handleBackToAll = () => {
    setFocusedComment(null);
  };

  if (isLoading) {
    return (
      <>
        <Navbar currentUser={currentUser} onLogout={handleLogout} loading={isLoading} />
        <PageSkeleton />
      </>
    );
  }

  return (
    <div>
      <Navbar currentUser={currentUser} onLogout={handleLogout} loading={isLoading} />
      <main className="mx-auto w-full px-4">
        <div className="flex flex-col xl:flex-row gap-8 lg:gap-12">
          <div className="w-full xl:w-2/5 mt-5">
            <PostCard totalComments={totalComments} />
          </div>
          <div className="w-full xl:w-3/5 py-8">
            {focusedComment ? (
              <FocusedThreadView
                parentComment={focusedComment}
                users={users}
                currentUser={currentUser}
                onBack={handleBackToAll}
                onAddReply={handleAddComment}
                onDelete={handleDelete}
                onUpvote={handleUpvote}
              />
            ) : (
              <>
                <NewCommentForm
                  currentUser={currentUser}
                  newCommentText={newCommentText}
                  setNewCommentText={setNewCommentText}
                  onSubmit={() => handleAddComment(null, newCommentText)}
                />
                <CommentsSection
                  totalComments={totalComments}
                  sortType={sortType}
                  setSortType={setSortType}
                  comments={sortedComments}
                  users={users}
                  userId={currentUser?.id}
                  currentUser={currentUser}
                  onAddReply={handleAddComment}
                  onDelete={handleDelete}
                  onUpvote={handleUpvote}
                  onViewThread={handleViewThread}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}