// backend/routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getComments, 
  createComment, 
  deleteComment, 
  upvoteComment 
} = require('../controllers/commentController');
const protect = require('../middlewares/authMiddleware');

router.get('/',protect, getComments);
router.post('/', protect, createComment);
router.delete('/:id', protect, deleteComment);
router.put('/:id/upvote', protect, upvoteComment);

module.exports = router;