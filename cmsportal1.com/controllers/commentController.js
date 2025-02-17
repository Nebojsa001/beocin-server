const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const appError = require("../utils/appError");
const Comment = require("../models/commentModel");

exports.createComment = catchAsync(async (req, res, next) => {
  const newComment = await Comment.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    content: req.body.content,
    postId: req.body.postId,
  });
  res.status(201).json({
    status: "success",
    message: "Uspešno ste objavili komentar",
    data: {
      comment: newComment,
    },
  });
});

exports.getAllComments = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Comment.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const comments = await features.query;
  res.status(201).json({
    status: "success",
    comments,
  });
});

exports.approveComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id, req.body);

  console.log(req.body);

  res.status(200).json({
    status: "success",
    message: "Uspešno ste odobrili komentar",
    komentar: comment,
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);

  if (!comment) {
    return next(new appError("Taj komentar nije pronađen", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Uspešno ste obrisali komentar",
    komentar: comment,
  });
});
