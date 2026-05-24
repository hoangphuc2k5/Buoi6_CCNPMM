const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

const Review = mongoose.model("review", reviewSchema);

module.exports = Review;
