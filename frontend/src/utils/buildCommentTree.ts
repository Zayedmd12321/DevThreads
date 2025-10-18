import { CommentType } from "@/types";

export const buildCommentTree = (comments: CommentType[]): CommentType[] => {
  const map: { [key: number]: CommentType } = {};
  const roots: CommentType[] = [];

  // 1. Map all comments by ID and initialize replies array
  comments.forEach((comment) => {
    map[comment.id] = { ...comment, replies: [] };
  });

  // 2. Build the tree structure
  comments.forEach((comment) => {
    if (comment.parent_id) {
      // If it has a parent, push it to the parent's replies array
      if (map[comment.parent_id]) {
        map[comment.parent_id].replies.push(map[comment.id]);
      }
    } else {
      // Otherwise, it's a root (top-level) comment
      roots.push(map[comment.id]);
    }
  });

  return roots;
};