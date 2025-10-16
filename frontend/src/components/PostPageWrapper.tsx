"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import NewCommentForm from "@/components/NewCommentForm";
import CommentsSection from "@/components/CommentsSection";

const API_BASE_URL = 'http://10.145.228.129:8000/api';

export default function PostPageWrapper() {
  const router = useRouter();
  // State now holds the entire user object from localStorage
  const [currentUser, setCurrentUser] = useState<any>(null); 
  const [comments, setComments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [sortType, setSortType] = useState("newest");
  const [newCommentText, setNewCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

  const handleAddComment = async (text: string, parentId: number | null) => {
    if (!text.trim() || !currentUser) return;
    try {
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
      setNewCommentText("");
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete comment');
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
      else if (sortType === "newest") arr.sort((a, b) => new Date(a.created_at).getTime() - new Date(a.created_at).getTime());
      else if (sortType === "oldest") arr.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      return arr.map(c => ({ ...c, replies: sortRec(c.replies || []) }));
    };
    return sortRec(comments);
  }, [comments, sortType]);

  const totalComments = useMemo(() => {
    const count = (list: any[]): number => {
      if (!Array.isArray(list)) return 0;
      return list.length + list.reduce((s, c) => s + count(c.replies || []), 0)
    };
    return count(comments);
  }, [comments]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-muted">Loading discussions...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      <main className="mx-auto w-full px-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="w-full lg:w-2/5 mt-5">
            <PostCard totalComments={totalComments} />
          </div>
          <div className="w-full lg:w-3/5 py-8">
            <NewCommentForm 
              currentUser={currentUser}
              newCommentText={newCommentText}
              setNewCommentText={setNewCommentText}
              onSubmit={() => handleAddComment(newCommentText, null)}
            />
            <CommentsSection 
              totalComments={totalComments}
              sortType={sortType}
              setSortType={setSortType}
              comments={sortedComments}
              users={users}
              userId={currentUser?.id}
              currentUser = {currentUser}
              onAddReply={(parentId, text) => handleAddComment(text, parentId)}
              onDelete={handleDelete}
              onUpvote={handleUpvote}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
