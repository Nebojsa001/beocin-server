const express = require("express");

const postController = require("./../controllers/postController");
const router = express.Router();

router.route("/newsdetails/:id/:name").get(postController.getBekPost);

module.exports = router;
