const Category = require("./../models/categoryModel");
const catchAsync = require("./../utils/catchAsync");
const appError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

exports.createCategory = catchAsync(async (req, res, next) => {
  const newCategory = await Category.create({
    name: req.body.name,
  });

  res.status(201).json({
    status: "success",
    message: "Kategorija uspešno kreirana",
    newCategory,
  });
});

exports.deteleCategory = catchAsync(async (req, res, next) => {
  const deletedCategory = await Category.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    message: "Uspešno ste obrisali kategoriju",
  });
  if (!deletedCategory) {
    return next(new appError("Kategorija nije pronađena!", 404));
  }
});

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Category.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const categories = await features.query;
  res.status(201).json({
    status: "success",
    categories,
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new appError("Kategorija nije pronađena!"));
  }

  res.status(201).json({
    status: "success",
    category,
  });
});
