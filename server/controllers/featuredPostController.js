const FeaturedPost = require("./../models/featuredModel");
const catchAsync = require("./../utils/catchAsync");
const appError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const Featured = require("./../models/featuredModel");
const Post = require("../models/postModel");

exports.featuredPost = catchAsync(async (req, res, next) => {
  await FeaturedPost.deleteMany();
  const featuredPost = await FeaturedPost.create(req.body);

  if (!featuredPost) {
    return next(new appError("Neuspesno dodeljivanje izdvojenih vesti", 500));
  } else {
    res.status(200).json({
      status: "success",
      featuredPost,
    });
  }
});

exports.getAllFeaturedPost = catchAsync(async (req, res, next) => {
  const featured = await FeaturedPost.find();

  const featuredPostId = featured[0].featured;
  console.log(featuredPostId);

  let featuredPost = [];
  let post;

  for (const id of featuredPostId) {
    post = await Post.findById(id).populate("category");
    featuredPost.push(post);
  }

  res.status(200).json({
    status: "success",
    featuredPost,
  });
});
