const orderService = require("../services/orderService");

const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { paymentMethod, shippingAddress } = req.body;
    
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address) {
      return res.status(400).json({
        EC: 1,
        EM: "Thiếu thông tin địa chỉ giao hàng",
        DT: ""
      });
    }

    const response = await orderService.createOrder(userId, { paymentMethod, shippingAddress });
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EC: -1,
      EM: "Lỗi server",
      DT: ""
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const response = await orderService.getOrdersByUserId(userId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EC: -1,
      EM: "Lỗi server",
      DT: ""
    });
  }
};

const getOrderDetail = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;
    
    if (!orderId) {
      return res.status(400).json({
        EC: 1,
        EM: "Thiếu orderId",
        DT: ""
      });
    }

    const response = await orderService.getOrderById(orderId, userId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EC: -1,
      EM: "Lỗi server",
      DT: ""
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;
    const { reason } = req.body;
    
    if (!orderId) {
      return res.status(400).json({
        EC: 1,
        EM: "Thiếu orderId",
        DT: ""
      });
    }

    const response = await orderService.cancelOrder(orderId, userId, reason);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EC: -1,
      EM: "Lỗi server",
      DT: ""
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderDetail,
  cancelOrder
};
