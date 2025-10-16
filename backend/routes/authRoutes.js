const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authController');

// When a POST request is made to /api/auth/login, it will run our controller logic
router.post('/login', loginUser);

module.exports = router;