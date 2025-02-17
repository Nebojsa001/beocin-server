const mongoose = require("mongoose");

const featuredSchema = new mongoose.Schema({
  featured: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

const Featured = mongoose.model("Featured", featuredSchema);

module.exports = Featured;
