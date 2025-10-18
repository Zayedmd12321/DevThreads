const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  likes: [{ type: Number }]
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;