const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    type: {
      type: String,
      enum: ["percent", "fixed"],
      default: "percent"
    },
    value: {
      type: Number,
      required: true
    },
    minOrder: {
      type: Number,
      default: 0
    },
    maxDiscount: {
      type: Number,
      default: 0
    },
    usageLimit: {
      type: Number,
      default: 0
    },
    usedCount: {
      type: Number,
      default: 0
    },
    startAt: {
      type: Date,
      default: null
    },
    endAt: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Voucher = mongoose.model("voucher", voucherSchema);

module.exports = Voucher;
