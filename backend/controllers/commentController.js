const Comment = require('../models/commentModel');
const buildCommentTree = require('../utils/buildCommentTree');

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({}).sort({ createdAt: -1 });
    const commentTree = buildCommentTree(comments);
    res.json(commentTree);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createComment = async (req, res) => {
  const { text, user_id, parent_id } = req.body;
  if (!text || !user_id) {
    return res.status(400).json({ message: 'Text and user_id are required' });
  }

  try {
    const lastComment = await Comment.findOne().sort({ id: -1 });
    const newId = lastComment ? lastComment.id + 1 : 1;

    const newComment = new Comment({
      id: newId,
      text,
      user_id,
      parent_id: parent_id || null,
    });
    
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentId = Number(req.params.id);
    const comment = await Comment.findOne({ id: commentId });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user_id !== req.user.id && !req.user.isAdmin) {
      res.status(401);
      throw new Error('User not authorized to delete this comment');
    }
    
    const idsToDelete = [commentId];
    const queue = [commentId];
    
    while(queue.length > 0) {
      const parentId = queue.shift();
      const replies = await Comment.find({ parent_id: parentId });
      for (const reply of replies) {
        idsToDelete.push(reply.id);
        queue.push(reply.id);
      }
    }

    await Comment.deleteMany({ id: { $in: idsToDelete } });
    res.json({ message: 'Comment and replies deleted successfully' });
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

const upvoteComment = async (req, res) => {
    try {
        const commentId = Number(req.params.id);
        const { hasUpvoted } = req.body;
        const updateOperation = hasUpvoted 
            ? { $inc: { upvotes: -1 } }
            : { $inc: { upvotes: 1 } };

        const updatedComment = await Comment.findOneAndUpdate(
            { id: commentId },
            updateOperation,
            { new: true }
        );

        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};


module.exports = {
  getComments,
  createComment,
  deleteComment,
  upvoteComment,
};