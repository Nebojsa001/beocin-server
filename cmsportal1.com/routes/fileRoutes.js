const express = require("express");

const fileController = require("../controllers/fileController");
const authController = require("../controllers/authController");
const router = express.Router();

//stiti sve rute prema dole
//router.use(authController.protect);
router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("superAdmin", "blogger"),
    fileController.uploadPdfFile,
    fileController.uploadFile
  )
  .get(fileController.getAllFiles);
module.exports = router;

router
  .route("/:id")
  .delete(
    authController.protect,
    authController.restrictTo("superAdmin", "blogger"),
    fileController.deleteFile
  );
