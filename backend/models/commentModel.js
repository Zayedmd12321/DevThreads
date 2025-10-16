const mongoose = require('mongoose');

// const commentSchema = new mongoose.Schema({
//   id: { type: Number, required: true, unique: true },
//   text: { type: String, required: true },
//   upvotes: { type: Number, default: 0 },
//   parent_id: { type: Number, default: null },
//   user_id: { type: String, required: true, ref: 'User' }
// }, {
//   timestamps: true
// });

const commentSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  text: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  parent_id: { type: Number, default: null },
  user_id: { type: String, required: true, ref: 'User' },
  created_at: { type: Date, required: true, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;