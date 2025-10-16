import PostPageWrapper from "@/components/PostPageWrapper";
import { buildCommentTree } from "@/utils/buildCommentTree";
import commentsData from "@/data/comments.json";
import usersData from "@/data/users.json";

// This is now a Server Component, so it can be async.
export default function Home() {
  return (
    <PostPageWrapper />
  );
}