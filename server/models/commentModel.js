const mongoose = require("mongoose");
const validator = require("validator");
const moment = require("moment-timezone");
//const Post = require("../models/postModel");

const commentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => moment.tz("Europe/Belgrade").add(2, "hours").toDate(),
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
