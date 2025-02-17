const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const commentController = require("../controllers/commentController");
const router = express.Router();

router
  .post("/", commentController.createComment)
  .get("/", commentController.getAllComments)
  .patch(
    "/:id",
    authController.protect,
    authController.restrictTo("blogger", "superAdmin"),
    commentController.approveComment
  )
  .delete(
    "/:id",
    authController.protect,
    authController.restrictTo("superAdmin", "blogger"),
    commentController.deleteComment
  );

module.exports = router;
