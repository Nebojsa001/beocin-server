const express = require("express");
const authController = require("../controllers/authController");
const tagController = require("../controllers/tagController");
const router = express.Router();

// router
//   .route("/")
//   .post(
//     authController.protect,
//     authController.restrictTo("superAdmin", "blogger"),
//     tagController.createCategory
//   )
//   .get(tagController.getAllCategories);

// router
//   .route("/:id")
//   .delete(
//     authController.protect,
//     authController.restrictTo("superAdmin", "blogger"),
//     tagController.deteleCategory
//   )
//   .get(tagController.getCategory);
router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("superAdmin", "blogger"),
    tagController.createTag
  )
  .get(tagController.getAllTags);

router
  .route("/:id")
  .delete(
    authController.protect,
    authController.restrictTo("superAdmin", "blogger"),
    tagController.deteleTag
  );

module.exports = router;
