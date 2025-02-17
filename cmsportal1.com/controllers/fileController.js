const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const appError = require("./../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");
const File = require("../models/fileModel");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/build/documents");
  },
  filename: function (req, file, cb) {
    req.uploadedFileLocation = Date.now() + "-" + file.originalname;
    cb(null, req.uploadedFileLocation);
  },
});
const upload = multer({
  storage: multerStorage,
});

exports.uploadPdfFile = upload.single("file");

exports.uploadFile = catchAsync(async (req, res, next) => {
  console.log(req.file.filename);
  const file = await File.create({
    fileName: req.body.fileName,
    url: req.file.path,
    type: req.body.type,
  });

  if (!file) {
    return next(new appError("Greška, niste upload nista", 400));
  }
  res.status(200).json({
    status: "success",
    file,
  });
});

exports.getAllFiles = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(File.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .search();

  const files = await features.query;

  if (!files) {
    return next(
      new appError("Neuspešno preuzimanje dokumenata, pokušajte ponovo!", 400)
    );
  }
  res.status(200).json({
    status: "success",
    files,
  });
});

exports.deleteFile = catchAsync(async (req, res, next) => {
  const file = await File.findByIdAndDelete(req.params.id);

  if (!file) {
    return next(new appError("Dokument ne postoji!", 404));
  }
  res.status(202).json({
    status: "success",
  });
});
