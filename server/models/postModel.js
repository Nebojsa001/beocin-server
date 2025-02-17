const mongoose = require("mongoose");
const validator = require("validator");
const moment = require("moment-timezone");
const { DateTime } = require("luxon");
// const Category = require("../models/categoryModel");
// const User = require("../models/userModel");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  introduction: {
    type: String,
    required: true,
  },
  authorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  imageCover: {
    type: String,
    //required: true,
  },
  content: {
    type: String,
    required: true,
  },
  visits: {
    type: Number,
    default: 0,
  },
  seoDescription: {
    type: String,
  },
  seoTitle: {
    type: String,
  },
  postLanguage: {
    type: String,
    default: "SRB",
  },
  createdAt: {
    type: Date,
    default: () => DateTime.now().setZone("Europe/Belgrade").toJSDate(),
  },
  publicationDate: {
    type: Date,
    default: () => DateTime.now().setZone("Europe/Belgrade").toJSDate(),
  },
});

postSchema.index({ publicationDate: -1 });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
