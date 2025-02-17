const mongoose = require("mongoose");
const validator = require("validator");
const moment = require("moment-timezone");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
