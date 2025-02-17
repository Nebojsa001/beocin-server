const express = require("express");
const multer = require("multer");
const path = require("path");

const postController = require("./../controllers/postController");
const authController = require("./../controllers/authController");
const featuredPostController = require("../controllers/featuredPostController");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../../frontend/public/images/");
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const uniqueFilename = uuidv4() + extname;
    cb(null, uniqueFilename);
  },
});
const upload = multer({
  storage,
  limits: { files: 5 },
  dest: "frontend/public/images",
});

router
  .route("/")
  .get(postController.getAllPosts)
  .post(
    authController.protect,
    authController.restrictTo("blogger", "superAdmin"),
    postController.createPost
  );

router
  .route("/:id")
  .get(postController.getPost)
  .delete(
    authController.protect,
    authController.restrictTo("blogger", "superAdmin"),
    postController.deletePost
  )
  .patch(
    authController.protect,
    authController.restrictTo("blogger", "superAdmin"),
    postController.editPost
  );

router
  .route("/uploadImage")
  .post(
    upload.array("slike", 5),
    authController.protect,
    authController.restrictTo("blogger", "marketer", "superAdmin"),
    postController.uploadImage
  );

router
  .route("/featuredPost")
  .get(featuredPostController.getAllFeaturedPost)
  .post(
    authController.protect,
    authController.restrictTo("superAdmin", "blogger"),
    featuredPostController.featuredPost
  );
module.exports = router;
