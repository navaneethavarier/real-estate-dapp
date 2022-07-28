const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
  nonce: {
    required: true,
    type: Number,
    default: () => Math.floor(Math.random() * 1000000), // Initialize with a random nonce
  },
  publicAddress: {
    required: true,
    type: String,
    unique: true,
    lowercase: true,
  },
  username: {
    type: String,
    unique: true,
  },
});

module.exports = mongoose.model("User", userSchema, "user");
