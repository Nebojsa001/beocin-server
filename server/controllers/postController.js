const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const mongoose = require("mongoose");

const Post = require("./../models/postModel");
const FeaturedPost = require("../models/featuredModel");
const catchAsync = require("./../utils/catchAsync");
const appError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const Comment = require("./../models/commentModel");
const { includes } = require("lodash");

const upload = multer({ dest: "../frontend/public/images" });

exports.createPost = catchAsync(async (req, res, next) => {
  const newPost = await Post.create({
    title: req.body.title,
    introduction: req.body.introduction,
    authorID: req.user._id.toString(),
    imageCover: req.body.imageCover,
    content: req.body.content,
    createdAt: req.body.createdAt,
    publicationDate: req.body.publicationDate,
    postLanguage: req.body.postLanguage,
  });
  if (newPost) {
    res.status(201).json({
      status: "success",
      message: "Uspešno ste objavili vest",
      data: {
        vest: newPost,
      },
    });
  }
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Post.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .search()
    .startEndDate();

  console.log(features.query.options);
  const posts = await features.query;

  res.status(200).json({
    message: "Success",
    result: posts.length,
    posts,
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate(
    "authorID",
    "firstName lastName"
  );
  const comments = await Comment.find({ postId: req.params.id });

  post.visits++;
  await post.save();

  res.status(200).json({
    status: "success",
    post: {
      post,
      comments,
    },
  });
});

exports.getTags = catchAsync(async (req, res, next) => {
  const tagIds = req.params.id
    .split(",")
    .map((id) => mongoose.Types.ObjectId(id.trim()));
  console.log(tagIds);

  const posts = await Post.find({ tags: { $in: tagIds } });
  console.log(posts);
  if (tagIds) {
    res.status(200).json({
      status: "success",
      posts,
    });
  }
});

exports.uploadImage = catchAsync(async (req, res, next) => {
  const { base64Images } = req.body;
  const uploadedImages = [];
  // const { base64Image } = req.body.slika;

  for (const base64Image of base64Images) {
    // Pretvorite Base64 sliku u binarne podatke
    const imageBuffer = Buffer.from(base64Image.split(",")[1], "base64");

    // Generiše jedinstveno ime za datoteku
    const extname = ".jpg"; // Postavlja automatski ekstenziju
    const uniqueFilename = uuidv4() + extname;
    console.log(uniqueFilename);

    // Sprema sliku kao datoteku na server
    const imagePath = `../frontend/public/images/${uniqueFilename}`;
    fs.writeFileSync(imagePath, imageBuffer);

    uploadedImages.push(uniqueFilename);
  }
  const updatedImagePaths = uploadedImages.map(
    (path) => `../../../images/${path}`
  );

  res.status(201).json({
    message: "Slika uspješno učitana",
    updatedImagePaths,
  });
});

exports.editPost = catchAsync(async (req, res, next) => {
  const editedPost = await Post.findByIdAndUpdate(req.params.id, req.body);

  if (!editedPost) {
    return next(new appError("Ta vijest nije pronađena", 404));
  } else {
    res.status(200).json({
      status: "success",
      message: "Vaša vest je uspešno promenjena",
      editedPost,
    });
  }
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const deletedPost = await Post.findByIdAndDelete(postId);

  if (!deletedPost) {
    return next(new appError("Ta vest nije pronađena", 404));
  }

  await Comment.deleteMany({ postId: req.params.id }); //brise sve komentare koje imaju postId vesti koja se brise

  res.status(200).json({
    status: "success",
    message: "Uspešno ste obrisali vest",
  });
});
