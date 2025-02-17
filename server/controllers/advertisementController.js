const appError = require("./../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Advertisement = require("../models/advertisementModel");
const APIFeatures = require("./../utils/apiFeatures");
const { login } = require("./authController");

exports.createAdvertisement = catchAsync(async (req, res, next) => {
  const newAdvertisement = await Advertisement.create({
    url: req.body.pathURL,
    advertisementImage: req.savedImage,
    active: req.body.active,
    position: req.body.position,
    advertisementName: req.body.advertisementName,
    dateStart: req.body.dateStart,
    dateEnd: req.body.dateEnd,
  });

  if (!newAdvertisement) {
    return next(new appError("Greška prilikom kreiranja oglasa/reklame", 400));
  }
  res.status(200).json({
    status: "Success",
    message: "Uspešno ste kreirali oglas/reklamu",
    newAdvertisement,
  });
});

exports.getAllAdvertisements = catchAsync(async (req, res, next) => {
  console.log("eeee");
  const features = new APIFeatures(Advertisement.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .search();

  const advertisements = await features.query;

  if (!advertisements) {
    return next(new appError("Greška prilikom kreiranja oglasa/reklame", 400));
  }

  res.status(200).json({
    status: "success",
    advertisements,
  });
});

// exports.setActiveAdvertisement = catchAsync(async (req, res, next) => {
//   const advertisement = await Advertisement.findById(req.params.id);

//   if (!advertisement) {
//     return next(new appError("Taj golas/reklama nije pronađena", 404));
//   }
//   if (!advertisement.active) {
//     advertisement.active = true;
//   } else {
//     advertisement.active = false;
//   }
//   await advertisement.save();

//   res.status(200).json({
//     status: "success",
//     message: "Uspešno ste aktivirali reklamu",
//     advertisement,
//   });
// });

exports.editAdvertisement = catchAsync(async (req, res, next) => {
  const advertisement = await Advertisement.findByIdAndUpdate(req.params.id, {
    url: req.body.pathURL,
    active: req.body.active,
    position: req.body.position,
    advertisementName: req.body.advertisementName,
    dateStart: req.body.dateStart,
    dateEnd: req.body.dateEnd,
  });

  if (!advertisement) {
    return next(new appError("Taj golas/reklama nije pronađena", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Uspešno ste promenili reklamu/oglas",
    advertisement,
  });
});

exports.deleteAdvertisement = catchAsync(async (req, res, next) => {
  const advertisement = await Advertisement.findByIdAndDelete(req.params.id);

  if (!advertisement) {
    return next(new appError("Taj golas/reklama nije pronađena", 404));
  }

  res.status(202).json({
    status: "success",
    message: "Uspešno ste obrisali reklamu/oglas",
  });
});
