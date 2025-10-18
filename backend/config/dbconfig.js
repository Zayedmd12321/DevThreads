const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://zayedmd12321:zayedZAYED12321@devthreads.7u6tkwd.mongodb.net/?retryWrites=true&w=majority&appName=DevThreads");
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;