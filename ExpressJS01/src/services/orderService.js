const { Order, ORDER_STATUS, PAYMENT_METHOD } = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Voucher = require("../models/voucher");

const createOrder = async (userId, orderData) => {
  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return {
        EC: 1,
        EM: "Giỏ hàng trống",
        DT: ""
      };
    }

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product || product.stock < item.quantity) {
        return {
          EC: 2,
          EM: `Sản phẩm ${item.product.name} không đủ hàng`,
          DT: ""
        };
      }
    }

    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images[0] || "",
      quantity: item.quantity,
      price: item.price
    }));

    let discountAmount = 0;
    let appliedVoucher = null;
    const originalPrice = cart.totalPrice;
    const voucherCode = orderData.voucherCode?.trim()?.toUpperCase();

    if (voucherCode) {
      const voucher = await Voucher.findOne({ code: voucherCode });
      const now = new Date();

      if (!voucher || !voucher.isActive) {
        return { EC: 3, EM: "Ma giam gia khong hop le", DT: "" };
      }

      if (voucher.startAt && now < voucher.startAt) {
        return { EC: 4, EM: "Ma giam gia chua den thoi gian ap dung", DT: "" };
      }

      if (voucher.endAt && now > voucher.endAt) {
        return { EC: 5, EM: "Ma giam gia da het han", DT: "" };
      }

      if (voucher.usageLimit > 0 && voucher.usedCount >= voucher.usageLimit) {
        return { EC: 6, EM: "Ma giam gia da het luot su dung", DT: "" };
      }

      if (voucher.minOrder > 0 && originalPrice < voucher.minOrder) {
        return { EC: 7, EM: "Don hang chua dat gia tri toi thieu", DT: "" };
      }

      if (voucher.type === "percent") {
        discountAmount = (originalPrice * voucher.value) / 100;
        if (voucher.maxDiscount > 0) {
          discountAmount = Math.min(discountAmount, voucher.maxDiscount);
        }
      } else {
        discountAmount = voucher.value;
      }

      discountAmount = Math.min(discountAmount, originalPrice);
      appliedVoucher = voucher;
    }

    const finalPrice = Math.max(originalPrice - discountAmount, 0);

    const order = new Order({
      user: userId,
      items: orderItems,
      totalPrice: finalPrice,
      originalPrice: originalPrice,
      discountAmount: discountAmount,
      voucherCode: appliedVoucher ? appliedVoucher.code : "",
      paymentMethod: orderData.paymentMethod || PAYMENT_METHOD.COD,
      shippingAddress: orderData.shippingAddress,
      status: ORDER_STATUS.NEW
    });

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        {
          $inc: { stock: -item.quantity, sold: item.quantity }
        }
      );
    }

    await order.save();
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    if (appliedVoucher) {
      await Voucher.findByIdAndUpdate(appliedVoucher._id, {
        $inc: { usedCount: 1 }
      });
    }

    setTimeout(async () => {
      const pendingOrder = await Order.findById(order._id);
      if (pendingOrder && pendingOrder.status === ORDER_STATUS.NEW) {
        await updateOrderStatus(order._id, ORDER_STATUS.CONFIRMED, "Đơn hàng đã được xác nhận tự động sau 30 phút");
      }
    }, 30 * 60 * 1000);

    return {
      EC: 0,
      EM: "Đặt hàng thành công",
      DT: order
    };
  } catch (error) {
    console.log(error);
    return {
      EC: -1,
      EM: "Lỗi server",
      DT: ""
    };
  }
};

const getOrdersByUserId = async (userId) => {
  try {
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("items.product");

    return {
      EC: 0,
      EM: "Lấy danh sách đơn hàng thành công",
      DT: orders
    };
  } catch (error) {
    console.log(error);
    return {
      EC: -1,
      EM: "Lỗi server",
      DT: ""
    };
  }
};

const getAllOrders = async () => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("items.product")
      .populate("user", "name email");

    return {
      EC: 0,
      EM: "Lay danh sach don hang thanh cong",
      DT: orders
    };
  } catch (error) {
    console.log(error);
    return {
      EC: -1,
      EM: "Loi server",
      DT: ""
    };
  }
};

const getOrderByIdAdmin = async (orderId) => {
  try {
    const order = await Order.findById(orderId)
      .populate("items.product")
      .populate("user", "name email");

    if (!order) {
      return {
        EC: 1,
        EM: "Don hang khong ton tai",
        DT: ""
      };
    }

    return {
      EC: 0,
      EM: "Lay don hang thanh cong",
      DT: order
    };
  } catch (error) {
    console.log(error);
    return {
      EC: -1,
      EM: "Loi server",
      DT: ""
    };
  }
};

const getOrderById = async (orderId, userId) => {
  try {
    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate("items.product");

    if (!order) {
      return {
        EC: 1,
        EM: "Đơn hàng không tồn tại",
        DT: ""
      };
    }

    return {
      EC: 0,
      EM: "Lấy đơn hàng thành công",
      DT: order
    };
  } catch (error) {
    console.log(error);
    return {
      EC: -1,
      EM: "Lỗi server",
      DT: ""
    };
  }
};

const updateOrderStatus = async (orderId, status, note = "") => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return {
        EC: 1,
        EM: "Đơn hàng không tồn tại",
        DT: ""
      };
    }

    order.status = status;
    order.statusHistory.push({
      status: status,
      note: note,
      timestamp: new Date()
    });

    await order.save();

    return {
      EC: 0,
      EM: "Cập nhật trạng thái đơn hàng thành công",
      DT: order
    };
  } catch (error) {
    console.log(error);
    return {
      EC: -1,
      EM: "Lỗi server",
      DT: ""
    };
  }
};

const updateOrderPaymentStatus = async (orderId, paymentStatus) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return {
        EC: 1,
        EM: "Đơn hàng không tồn tại",
        DT: ""
      };
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    return {
      EC: 0,
      EM: "Cập nhật trạng thái thanh toán thành công",
      DT: order
    };
  } catch (error) {
    console.log(error);
    return {
      EC: -1,
      EM: "Lỗi server",
      DT: ""
    };
  }
};

const cancelOrder = async (orderId, userId, reason = "") => {
  try {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return {
        EC: 1,
        EM: "Đơn hàng không tồn tại",
        DT: ""
      };
    }

    const timeSinceOrder = new Date() - new Date(order.createdAt);
    const thirtyMinutes = 30 * 60 * 1000;

    if (timeSinceOrder > thirtyMinutes || order.status > ORDER_STATUS.CONFIRMED) {
      if (order.status === ORDER_STATUS.PREPARING) {
        order.status = ORDER_STATUS.CANCELLATION_REQUESTED;
        order.cancellationReason = reason;
        order.statusHistory.push({
          status: ORDER_STATUS.CANCELLATION_REQUESTED,
          note: reason || "Yêu cầu hủy đơn hàng",
          timestamp: new Date()
        });
        await order.save();

        return {
          EC: 2,
          EM: "Đã gửi yêu cầu hủy đơn hàng cho shop",
          DT: order
        };
      }

      return {
        EC: 3,
        EM: "Không thể hủy đơn hàng (đã quá 30 phút hoặc đơn hàng đã được xử lý)",
        DT: ""
      };
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: { stock: item.quantity, sold: -item.quantity }
        }
      );
    }

    order.status = ORDER_STATUS.CANCELLED;
    order.cancellationReason = reason;
    order.statusHistory.push({
      status: ORDER_STATUS.CANCELLED,
      note: reason || "Đơn hàng đã bị hủy",
      timestamp: new Date()
    });

    await order.save();

    return {
      EC: 0,
      EM: "Hủy đơn hàng thành công",
      DT: order
    };
  } catch (error) {
    console.log(error);
    return {
      EC: -1,
      EM: "Lỗi server",
      DT: ""
    };
  }
};

module.exports = {
  createOrder,
  getOrdersByUserId,
  getOrderById,
  getAllOrders,
  getOrderByIdAdmin,
  updateOrderStatus,
  updateOrderPaymentStatus,
  cancelOrder
};
