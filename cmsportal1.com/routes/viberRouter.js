const express = require("express");

const viberApiController = require("./../controllers/viberApiController");

const router = express.Router();

router
  .route("/")
  .get(viberApiController.webHook)
  .post(viberApiController.webHook);

module.exports = router;
