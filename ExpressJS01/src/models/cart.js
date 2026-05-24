const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  },
  {
    _id: false
  }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

cartSchema.pre("save", function (next) {
  this.totalPrice = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  next();
});

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;
