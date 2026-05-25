const mongoose = require("mongoose");

const ORDER_STATUS = {
  NEW: 1,
  CONFIRMED: 2,
  PREPARING: 3,
  SHIPPING: 4,
  DELIVERED: 5,
  CANCELLED: 6,
  CANCELLATION_REQUESTED: 7
};

const PAYMENT_METHOD = {
  COD: "COD",
  EWALLET: "EWALLET"
};

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: ""
    },
    quantity: {
      type: Number,
      required: true,
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

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    items: [orderItemSchema],
    totalPrice: {
      type: Number,
      required: true
    },
    originalPrice: {
      type: Number,
      default: 0
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    voucherCode: {
      type: String,
      default: ""
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
      default: PAYMENT_METHOD.COD,
      required: true
    },
    paymentStatus: {
      type: Boolean,
      default: false
    },
    status: {
      type: Number,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.NEW,
      required: true
    },
    shippingAddress: {
      fullName: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      address: {
        type: String,
        required: true
      },
      note: {
        type: String,
        default: ""
      }
    },
    cancellationReason: {
      type: String,
      default: ""
    },
    statusHistory: [
      {
        status: {
          type: Number,
          enum: Object.values(ORDER_STATUS),
          required: true
        },
        note: {
          type: String,
          default: ""
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

orderSchema.pre("save", function (next) {
  if (this.isNew && this.statusHistory.length === 0) {
    this.statusHistory.push({
      status: this.status,
      note: "Đơn hàng mới được tạo",
      timestamp: this.createdAt
    });
  }
  next();
});

const Order = mongoose.model("order", orderSchema);

module.exports = { Order, ORDER_STATUS, PAYMENT_METHOD };
