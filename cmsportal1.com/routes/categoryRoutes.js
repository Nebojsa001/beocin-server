const express = require("express");
const authController = require("../controllers/authController");
const commentController = require("../controllers/commentController");
const categoryController = require("../controllers/categoryController");
const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("superAdmin", "blogger"),
    categoryController.createCategory
  )
  .get(categoryController.getAllCategories);

router
  .route("/:id")
  .delete(
    authController.protect,
    authController.restrictTo("superAdmin", "blogger"),
    categoryController.deteleCategory
  )
  .get(categoryController.getCategory);

module.exports = router;
