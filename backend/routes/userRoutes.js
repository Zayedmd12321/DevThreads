const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;