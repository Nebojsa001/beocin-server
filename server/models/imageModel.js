const mongoose = require("mongoose");
const validator = require("validator");
const { DateTime } = require("luxon");

const imageSchema = new mongoose.Schema({
  imageName: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    default: "Poljoprivrednik",
  },
  createdAt: {
    type: Date,
    default: () => DateTime.now().setZone("Europe/Belgrade").toJSDate(),
  },
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
