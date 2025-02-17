const express = require("express");

const postController = require("../controllers/postController");
const authController = require("../controllers/authController");
const imageController = require("../controllers/imageController");
const router = express.Router();

//stiti sve rute prema dole
//router.use(authController.protect);
router
  .route("/")
  .post(
    authController.protect,
    imageController.uploadPostCoverImage,
    imageController.resizePostCoverImage,
    imageController.uploadImage
  )
  .delete(authController.protect, imageController.deleteAllImages)
  .get(imageController.getAllImages);

// router
// .route("/advertisement")
// .post(authController.protect,
//    authController.restrictTo("superAdmin", "marketer"),
//    imageController.uploadPostCoverImage,
//    imageController.resizePostCoverImage,
//    imageController.uploadAdvertisementImage
//  )
//  .get(imageController.getAdvertisementImages)
router.route("/getImagesByTags").get(imageController.searchImagesByTags);

router.route("/:id").get(imageController.getImage);
router.route("/getImageTag/:id").get(imageController.getTags);
module.exports = router;
