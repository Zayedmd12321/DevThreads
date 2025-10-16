const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const loginUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    res.status(400);
    throw new Error('User ID is required');
  }
  const user = await User.findOne({ id: id });

  if (user) {
    res.json({
      _id: user._id,
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('User not found. Please check the ID.');
  }
});

module.exports = { loginUser };