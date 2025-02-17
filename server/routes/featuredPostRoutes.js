const express = require("express");
const multer = require("multer");
const path = require("path");

const postController = require("./../controllers/postController");
const authController = require("./../controllers/authController");
const featuredPostController = require("../controllers/featuredPostController");
const router = express.Router();

router
  .route("/")
  .get(featuredPostController.getAllFeaturedPost)
  .post(
    authController.protect,
    authController.restrictTo("superAdmin", "blogger"),
    featuredPostController.featuredPost
  );

module.exports = router;
