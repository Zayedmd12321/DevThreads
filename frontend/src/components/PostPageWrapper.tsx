"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import NewCommentForm from "@/components/NewCommentForm";
import CommentsSection from "@/components/CommentsSection";

// Define props to accept the data passed from the Server Component
interface PostPageWrapperProps {
  initialComments: any[];
  users: any[];
}

export default function PostPageWrapper({ initialComments, users: initialUsers }: PostPageWrapperProps) {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  
  // Initialize state with the props from the server, not from a file import
  const [comments, setComments] = useState<any[]>(initialComments);
  const [users, setUsers] = useState<any[]>(initialUsers);
  
  const [sortType, setSortType] = useState("newest");
  const [newCommentText, setNewCommentText] = useState("");

  // This effect still runs on the client to check for the user's login status
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    const id = localStorage.getItem("userId");
    if (!loggedIn) {
      router.push("/login");
    } else {
      setUserId(id || "");
    }
  }, [router]);

  const currentUser = useMemo(() => users.find((u) => u.id === userId), [users, userId]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleAddTopLevelComment = () => {
    if (!newCommentText.trim() || !currentUser) return;
    const newComment = {
      id: Date.now(),
      parent_id: null,
      text: newCommentText.trim(),
      upvotes: 0,
      created_at: new Date().toISOString(),
      user_id: currentUser.id,
      replies: [],
    };
    setComments(prev => [newComment, ...prev]);
    setNewCommentText("");
  };

  const handleAddReply = (parentId: number, text: string) => {
    if (!currentUser) return;
    const newReply = { id: Date.now(), parent_id: parentId, text: text.trim(), upvotes: 0, created_at: new Date().toISOString(), user_id: currentUser.id, replies: [] };
    const addRecursively = (list: any[]): any[] => list.map(c => c.id === parentId ? { ...c, replies: [newReply, ...(c.replies || [])] } : { ...c, replies: addRecursively(c.replies || []) });
    setComments(prev => addRecursively(prev));
  };

  const handleDelete = (commentId: number) => {
    const del = (list: any[]): any[] => list.filter(c => c.id !== commentId).map(c => ({ ...c, replies: del(c.replies || []) }));
    setComments(prev => del(prev));
  };

  const handleUpvote = (commentId: number, hasUpvoted: boolean) => {
    const update = (list: any[]): any[] => list.map(c => c.id === commentId ? { ...c, upvotes: hasUpvoted ? Math.max(0, c.upvotes - 1) : c.upvotes + 1 } : { ...c, replies: update(c.replies || []) });
    setComments(prev => update(prev));
  };

  const sortedComments = useMemo(() => {
    const sortRec = (list: any[]): any[] => {
      const arr = [...list];
      if (sortType === "most-upvoted") arr.sort((a, b) => b.upvotes - a.upvotes);
      else if (sortType === "newest") arr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      else if (sortType === "oldest") arr.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      return arr.map(c => ({ ...c, replies: sortRec(c.replies || []) }));
    };
    return sortRec(comments);
  }, [comments, sortType]);

  const totalComments = useMemo(() => {
    const count = (list: any[]): number => list.length + list.reduce((s, c) => s + count(c.replies || []), 0);
    return count(comments);
  }, [comments]);

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
              onSubmit={handleAddTopLevelComment}
            />
            <CommentsSection 
              totalComments={totalComments}
              sortType={sortType}
              setSortType={setSortType}
              comments={sortedComments}
              users={users}
              userId={userId}
              onAddReply={handleAddReply}
              onDelete={handleDelete}
              onUpvote={handleUpvote}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
