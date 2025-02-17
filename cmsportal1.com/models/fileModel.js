const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => DateTime.now().setZone("Europe/Belgrade").toJSDate(),
  },
});

const File = mongoose.model("File", fileSchema);

module.exports = File;
