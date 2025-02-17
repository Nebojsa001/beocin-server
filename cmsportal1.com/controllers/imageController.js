const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const appError = require("./../utils/appError");
const Post = require("./../models/postModel");
const catchAsync = require("../utils/catchAsync");
const Image = require("../models/imageModel");
const advertisementImage = require("../models/advertisementImageModel");
const APIFeatures = require("./../utils/apiFeatures");
const mongoose = require("mongoose");
const AdvertisementImage = require("../models/advertisementImageModel");
const { aggregate } = require("../models/tagModel");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  //provjerava da li je unesen fajl slika, ako je nastavlja middleware
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new appError("Nepoznat format slike!"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPostCoverImage = upload.single("image"); //smijesta sliku treniutno u fajl u buducnosti na s3

exports.resizePostCoverImage = catchAsync(async (req, res, next) => {
  // Resajzuje sliku
  if (!req.file) return next();

  // Kreira ime fajla za sačuvanje
  req.file.filename = `${req.file.originalname.split(".")[0]}${
    req.user.id
  }${Date.now()}.webp`;

  // Koristi sharp za promjenu formata
  let processedImage = sharp(req.file.buffer).toFormat("webp");

  if (req.file.buffer.length > 1024 * 1024) {
    //1mb
    processedImage = processedImage.webp({ quality: 5 });
  } else if (req.file.buffer.length > 256 * 1024) {
    //256kb
    processedImage = processedImage.webp({ quality: 10 });
  }
  await processedImage.toFile(`../adminpanel/images/${req.file.filename}`);
  next();
});

exports.uploadImage = catchAsync(async (req, res, next) => {
  //smijesta sliku u bazu
  const savedImage = `https://manage-it.online/adminpanel/images/${req.file.filename}`;
  const newImage = await Image.create({
    imageName: req.file.filename,
    url: savedImage,
    author: req.body.author,
  });
  if (req.file) {
    res.status(200).json({
      status: "success",
      message: "Uspešno ste dodali sliku",
      image: newImage,
    });
  } else {
    return next(new appError("Greška prilikom upisa slike", 400));
  }
});

exports.getTags = catchAsync(async (req, res, next) => {
  const tagIds = req.params.id
    .split(",")
    .map((id) => mongoose.Types.ObjectId(id.trim()));

  const posts = await Image.find({ tags: { $in: tagIds } });
  if (tagIds) {
    res.status(200).json({
      status: "success",
      posts,
    });
  }
});

exports.getAllImages = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Image.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .category()
    .search()
    .startEndDate()
    .findByTags();

  const images = await features.query;

  if (images) {
    res.status(200).json({
      images,
    });
  } else {
    return next(new appError("Greška prilikom ispisivanja slika", 400));
  }
});

exports.getImage = catchAsync(async (req, res, next) => {
  const image = await Image.findById(req.params.id);
  if (!image) {
    return next(
      new appError("Greška prilikom ispisa jedne slike, pogrešan ID", 404)
    );
  } else {
    res.status(200).json({
      status: "success",
      image,
    });
  }
});

exports.searchImagesByTags = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const tagIds = req.query.tags
    .split(",")
    .map((tag) => mongoose.Types.ObjectId(tag));

  const aggregatePipeline = [
    {
      $match: {
        tags: { $all: tagIds },
      },
    },
    {
      $addFields: {
        matchingTags: {
          $size: { $setIntersection: ["$tags", tagIds] },
        },
      },
    },
    { $sort: { matchingTags: -1 } },
    { $limit: limit },
  ];

  if (req.query.author) {
    const author = { author: req.query.author };
    aggregatePipeline[0].$match = { ...aggregatePipeline[0].$match, ...author };
  }

  console.log(aggregatePipeline);
  const images = await Image.aggregate(aggregatePipeline);

  res.status(200).json({
    status: "success",
    images,
  });
});

exports.deleteAllImages = catchAsync(async (req, res, next) => {
  const deletedImages = await Image.deleteMany();

  if (deletedImages) {
    res.status(204).json({
      status: "success",
      message: "Uspesno ste pobrisali sve slike",
    });
  }
});

//advertisementImages Controller

exports.uploadAdvertisementImage = catchAsync(async (req, res, next) => {
  const savedImage = `../../../advertisementImages/${req.file.filename}`;
  req.savedImage = savedImage; //saljemo u middleware
});
exports.uploadAdvertisementImage = catchAsync(async (req, res, next) => {
  const savedImage = `../../../advertisementImages/${req.file.filename}`;
  req.savedImage = savedImage; //saljemo u middleware
});
exports.uploadAdvertisementImage = catchAsync(async (req, res, next) => {
  const savedImage = `../../../advertisementImages/${req.file.filename}`;
  req.savedImage = savedImage; //saljemo u middleware

  const newImage = await advertisementImage.create({
    imageName: req.file.filename,
    url: savedImage,
  });

  if (!newImage) {
    return next(new appError("Greška prilikom upisa slike", 400));
  }

  next();
});

exports.getAdvertisementImages = catchAsync(async (req, res, next) => {
  const advertisementImages = await AdvertisementImage.find();

  if (!advertisementImages) {
    return next(new appError("Greška prilikom ispisa slika", 400));
  }

  res.status(200).json({
    status: "success",
    advertisementImages,
  });
});
