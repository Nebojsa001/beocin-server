const mongoose = require("mongoose");

const advertisementImageSchema = new mongoose.Schema({
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
});

const AdvertisementImage = mongoose.model("AdvertisementImage", advertisementImageSchema);

module.exports = AdvertisementImage;
