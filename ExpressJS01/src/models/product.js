const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    price: {
      type: Number,
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true
    },
    rating: {
      type: Number,
      default: 0
    },
    stock: {
      type: Number,
      default: 0
    },
    sold: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    },
    isNewProduct: {
      type: Boolean,
      default: false
    },
    isBestSeller: {
      type: Boolean,
      default: false
    },
    isPromo: {
      type: Boolean,
      default: false
    },
    discountPercent: {
      type: Number,
      default: 0
    },
    images: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;
