import PostPageWrapper from "@/components/PostPageWrapper";
import { buildCommentTree } from "@/utils/buildCommentTree";
import commentsData from "@/data/comments.json";
import usersData from "@/data/users.json";

// This is now a Server Component, so it can be async.
export default async function Home() {
  // Data fetching and preparation happens on the server, before the page is sent to the client.
  const initialComments = buildCommentTree(commentsData);
  const users = usersData;

  // We render the client wrapper and pass the server-prepared data as props.
  return (
    <PostPageWrapper 
      initialComments={initialComments} 
      users={users} 
    />
  );
}