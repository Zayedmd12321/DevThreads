export interface User {
  id: string;
  name: string;
  avatar: string;
  isAdmin?: boolean;
}

export interface CommentType {
  id: number;
  user_id: string;
  text: string;
  upvotes: number;
  created_at: string;
  parent_id: number | null;
  hasUpvoted?: boolean;
  replies: CommentType[];
}

