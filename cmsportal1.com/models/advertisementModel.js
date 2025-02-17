const mongoose = require("mongoose");

const advertisementSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  advertisementImage: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String,
    required: true,
  },
  advertisementName: {
    type: String,
    required: true,
  },
  dateStart: {
    type: Date,
    required: true,
  },
  dateEnd: {
    type: Date,
    required: true,
  },
});

const Advertisement = mongoose.model("Advertisement", advertisementSchema);

module.exports = Advertisement;
