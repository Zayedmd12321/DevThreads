const buildCommentTree = (comments) => {
  const commentMap = {};
  const roots = [];
  const plainComments = comments.map(c => c.toObject());

  plainComments.forEach(comment => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  plainComments.forEach(comment => {
    if (comment.parent_id && commentMap[comment.parent_id]) {
      commentMap[comment.parent_id].replies.push(commentMap[comment.id]);
    } else {
      roots.push(commentMap[comment.id]);
    }
  });
  return roots;
};

module.exports = buildCommentTree;