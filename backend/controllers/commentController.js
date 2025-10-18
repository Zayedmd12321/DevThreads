const Comment = require('../models/commentModel');
const User = require('../models/userModel')
const buildCommentTree = require('../utils/buildCommentTree');

// In commentController.js

const getComments = async (req, res) => {
  try {
    console.log("--- getComments Step 1: Reading user ---");
    let userLikes = new Set();
    if (req.user && req.user.likes) {
        userLikes = new Set(req.user.likes);
    }
    console.log("--- getComments Step 2: Fetching comments from DB ---");
    const comments = await Comment.find({}).sort({ createdAt: -1 });

    console.log(`--- getComments Step 3: Mapping ${comments.length} comments ---`);
    const commentsWithUserStatus = comments.map(comment => {
        const plainComment = comment.toObject(); 
        return {
            ...plainComment,
            hasUpvoted: userLikes.has(plainComment.id)
        };
    });

    console.log("--- getComments Step 4: Building comment tree ---");
    const commentTree = buildCommentTree(commentsWithUserStatus);

    console.log("--- getComments Step 5: Sending JSON response ---");
    res.json(commentTree);

  } catch (error) {
    // This will now print the exact error to your server console
    console.error('!!! ERROR IN getComments:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// In commentController.js

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
      upvotes: 0, // <-- ADD THIS
      // 'created_at' will be added by timestamps, but let's return it clean
    });

    const savedComment = await newComment.save();
    
    // Also add hasUpvoted: false for the new comment
    const plainComment = savedComment.toObject();
    
    res.status(201).json({ ...plainComment, hasUpvoted: false }); // <-- RETURN A CLEAN OBJECT

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

    while (queue.length > 0) {
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

// In commentController.js

const upvoteComment = async (req, res) => {
    try {
        const commentId = Number(req.params.id);
        const { hasUpvoted } = req.body; 
        
        // --- Step 1: Update Comment (This was already correct) ---
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

        // --- Step 2: Update User's 'likes' array ---
        const userUpdateOperation = hasUpvoted
            ? { $pull: { likes: commentId } } 
            : { $addToSet: { likes: commentId } };
        
        // --- THIS IS THE FIX ---
        // We use findOneAndUpdate and query using the custom 'id' field,
        // which matches req.user.id (e.g., 'admin')
        await User.findOneAndUpdate(
            { id: req.user.id }, // Find user by { id: 'admin' }
            userUpdateOperation
        );
        // --- END FIX ---

        res.json(updatedComment);
    } catch (error) {
        console.error('Error in upvoteComment:', error);
        res.status(500).json({ message: 'Server Error', error });
    }
};


module.exports = {
  getComments,
  createComment,
  deleteComment,
  upvoteComment,
};