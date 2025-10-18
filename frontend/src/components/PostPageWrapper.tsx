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

const mapComments = (
  comments: any[],
  commentId: string | number,
  updateFn: (comment: any) => any,
): any[] => {
  return comments.map((comment) => {
    if (comment.id === commentId) {
      return updateFn(comment); // Apply the update
    }
    if (comment.replies) {
      return {
        ...comment,
        replies: mapComments(comment.replies, commentId, updateFn),
      };
    }
    return comment;
  });
};

const removeComment = (
  comments: any[],
  commentId: string | number,
): any[] => {
  return comments
    .filter((comment) => comment.id !== commentId)
    .map((comment) => {
      if (comment.replies) {
        return { ...comment, replies: removeComment(comment.replies, commentId) };
      }
      return comment;
    });
};

export default function PostPageWrapper() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [sortType, setSortType] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [focusedCommentId, setFocusedCommentId] = useState<
    string | number | null
  >(null);

  const getAuthHeaders = useCallback((): Record<string, string> => {
    // ... (your code is perfect, no change)
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    if (userInfo && userInfo.token) {
      headers["Authorization"] = `Bearer ${userInfo.token}`;
    }
    return headers;
  }, []);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/comments`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error(error);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    // ... (your code is perfect, no change)
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
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
          fetchComments(),
        ]);
        if (!usersRes.ok) throw new Error("Failed to fetch users");
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
    // ... (your code is perfect, no change)
    localStorage.clear();
    router.push("/login");
  };

  // --- FIX 4: Refactor handleAddComment ---
  // (Assumes NewCommentForm gives us the text)
  const handleAddComment = async (parentId: number | null, text: string) => {
    if (!text.trim() || !currentUser) return;

    const tempId = `temp-${Date.now()}`;
    const newCommentOptimistic = {
      id: tempId,
      text: text.trim(),
      user_id: currentUser.id,
      parent_id: parentId,
      created_at: new Date().toISOString(),
      upvotes: 0,
      replies: [],
      hasUpvoted: false, // Make sure to add this!
    };

    const addCommentToState = (list: any[], comment: any): any[] => {
      // ... (your helper function is perfect, no change)
      if (comment.parent_id === null) {
        return [comment, ...list];
      }
      return list.map((c) => {
        if (c.id === comment.parent_id) {
          return { ...c, replies: [comment, ...(c.replies || [])] };
        }
        if (c.replies && c.replies.length > 0) {
          return { ...c, replies: addCommentToState(c.replies, comment) };
        }
        return c;
      });
    };

    // 1. Optimistically add to state
    setComments((prevComments) =>
      addCommentToState(prevComments, newCommentOptimistic),
    );

    // 2. This line is no longer needed (NewCommentForm clears itself)
    // setNewCommentText("");

    try {
      // 3. Send request
      const res = await fetch(`${API_BASE_URL}/comments`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          text: text.trim(),
          user_id: currentUser.id,
          parent_id: parentId,
        }),
      });

      if (!res.ok) throw new Error("Failed to post comment");

      // 4. Get real comment back from API
      const newCommentFromApi = await res.json();

      // 5. Replace the temporary comment with the real one
      const replaceFn = (comment: any) => {
        return comment.id === tempId ? newCommentFromApi : comment;
      };
      setComments((prevComments) =>
        mapComments(prevComments, tempId, replaceFn),
      );

      // 6. REMOVED: await fetchComments(); (This is the fix!)
      // 7. REMOVED: The slow 'if (parentId && focusedComment)' block.
      //    The useMemo fix (Fix 7) handles this automatically now.
    } catch (error) {
      console.error(error);
      alert("Failed to post comment. Please try again.");
      // 8. On fail, remove the optimistic comment
      setComments((prevComments) => removeComment(prevComments, tempId));
    }
  };

  // --- FIX 5: Refactor handleDelete (Optimistic) ---
  const handleDelete = async (commentId: number) => {
    // 1. Save old state for rollback
    const oldComments = comments;

    // 2. Optimistically remove the comment
    setComments((prevComments) => removeComment(prevComments, commentId));

    // 3. If focused comment was deleted, go back
    if (focusedCommentId === commentId) {
      setFocusedCommentId(null);
    }

    // 4. Send API request in background
    try {
      const res = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete comment");
      // 5. REMOVED: fetchComments(); (Success! Do nothing.)
    } catch (error) {
      console.error(error);
      // 6. On failure, revert state
      alert("Failed to delete comment.");
      setComments(oldComments);
    }
  };

  // --- FIX 6: Refactor handleUpvote (Optimistic) ---
  const handleUpvote = async (commentId: number, hasUpvoted: boolean) => {
    // 1. Define the optimistic update function
    const updateFn = (comment: any) => ({
      ...comment,
      upvotes: hasUpvoted ? comment.upvotes - 1 : comment.upvotes + 1,
      hasUpvoted: !hasUpvoted,
    });

    // 2. Optimistically update state
    setComments((prevComments) => mapComments(prevComments, commentId, updateFn));

    // 3. Send API request in background
    try {
      const res = await fetch(`${API_BASE_URL}/comments/${commentId}/upvote`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ hasUpvoted }), // Send the *old* status
      });
      if (!res.ok) throw new Error("Failed to upvote comment");
      // 4. REMOVED: fetchComments(); (Success! Do nothing.)
    } catch (error) {
      console.error(error);
      // 5. On failure, revert state
      alert("Failed to save upvote.");
      const revertFn = (comment: any) => ({
        ...comment,
        upvotes: hasUpvoted ? comment.upvotes + 1 : comment.upvotes - 1,
        hasUpvoted: hasUpvoted,
      });
      setComments((prevComments) =>
        mapComments(prevComments, commentId, revertFn),
      );
    }
  };

  const sortedComments = useMemo(() => {
    // ... (your code is perfect, no change)
    const sortRec = (list: any[]): any[] => {
      if (!Array.isArray(list)) return [];
      const arr = [...list];
      if (sortType === "most-upvoted")
        arr.sort((a, b) => b.upvotes - a.upvotes);
      else if (sortType === "newest")
        arr.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      else if (sortType === "oldest")
        arr.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        );
      return arr.map((c) => ({ ...c, replies: sortRec(c.replies || []) }));
    };
    return sortRec(comments);
  }, [comments, sortType]);

  const totalComments = useMemo(() => {
    // ... (your code is perfect, no change)
    const count = (list: any[]): number => {
      if (!Array.isArray(list)) return 0;
      return list.length + list.reduce((s, c) => s + count(c.replies || []), 0);
    };
    return count(comments);
  }, [comments]);

  // --- FIX 7: Memoize findCommentById and derive focusedComment ---

  // Wrap this in useCallback so useMemo doesn't re-run unnecessarily
  const findCommentById = useCallback(
    (id: string | number, commentList: any[]): any | null => {
      for (const comment of commentList) {
        if (comment.id === id) return comment;
        if (comment.replies) {
          const found = findCommentById(id, comment.replies);
          if (found) return found;
        }
      }
      return null;
    },
    [],
  ); // Empty deps is correct, it's a pure function

  // Derive the focused comment object from state.
  // This is ALWAYS up-to-date.
  const focusedComment = useMemo(() => {
    if (!focusedCommentId) return null;
    return findCommentById(focusedCommentId, comments);
  }, [focusedCommentId, comments, findCommentById]);

  // --- FIX 8: Update handlers to use ID state ---
  const handleViewThread = (commentId: number) => {
    // const comment = findCommentById(commentId, comments);
    setFocusedCommentId(commentId);
  };

  const handleBackToAll = () => {
    setFocusedCommentId(null);
  };

  if (isLoading) {
    // ... (your code is perfect, no change)
    return (
      <>
        <Navbar
          currentUser={currentUser}
          onLogout={handleLogout}
          loading={isLoading}
        />
        <PageSkeleton />
      </>
    );
  }

  return (
    <div>
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        loading={isLoading}
      />
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
                {/* --- FIX 9: Update NewCommentForm props --- */}
                <NewCommentForm
                  currentUser={currentUser}
                  // REMOVED: newCommentText={newCommentText}
                  // REMOVED: setNewCommentText={setNewCommentText}
                  // UPDATED: onSubmit now expects text
                  onSubmit={(text: string) => handleAddComment(null, text)}
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