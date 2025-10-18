import PostPageWrapper from "@/components/PostPageWrapper";
import { buildCommentTree } from "@/utils/buildCommentTree";

// This is now a Server Component, so it can be async.
export default function Home() {
  return (
    <PostPageWrapper />
  );
}