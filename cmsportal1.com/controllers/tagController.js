const Tag = require("./../models/tagModel");
const catchAsync = require("./../utils/catchAsync");
const appError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

exports.createTag = catchAsync(async (req, res, next) => {
  const newTag = await Tag.create({
    name: req.body.name,
  });

  res.status(201).json({
    status: "success",
    message: "Tag je uspešno kreiran",
    newTag,
  });
});

exports.deteleTag = catchAsync(async (req, res, next) => {
  const deletedTag = await Tag.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    message: "Uspešno ste obrisali tag",
  });
  if (!deletedTag) {
    return next(new appError("Taj tag nije pronađen!", 404));
  }
});

exports.getAllTags = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tag.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tags = await features.query;
  res.status(201).json({
    status: "success",
    tags,
  });
});

exports.getTag = catchAsync(async (req, res, next) => {
  const Tag = await Tag.findById(req.params.id);

  if (!Tag) {
    return next(new appError("Tag nije pronađen!"));
  }

  res.status(201).json({
    status: "success",
    Tag,
  });
});
