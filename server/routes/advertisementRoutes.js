const express = require("express");
const imageController = require("../controllers/imageController");
const authController = require("../controllers/authController");
const advertisementController = require("../controllers/advertisementController");
const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("superAdmin", "marketer"),
    imageController.uploadPostCoverImage,
    imageController.resizePostCoverImage,
    imageController.uploadAdvertisementImage,
    advertisementController.createAdvertisement
  )
  .get(advertisementController.getAllAdvertisements);

router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo("superAdmin", "marketer"),
    advertisementController.editAdvertisement
  )
  .delete(
    authController.protect,
    authController.restrictTo("superAdmin", "marketer"),
    advertisementController.deleteAdvertisement
  );
module.exports = router;
