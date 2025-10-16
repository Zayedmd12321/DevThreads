const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/dbconfig');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');
const usersData = require('../data/users.json');
const commentsData = require('../data/comments.json');

dotenv.config({ path: './backend/.env' });

const importData = async () => {
  await connectDB();
  try {
    await User.deleteMany();
    await Comment.deleteMany();

    await User.insertMany(usersData);
    await Comment.insertMany(commentsData);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();