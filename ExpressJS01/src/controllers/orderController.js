const orderService = require("../services/orderService");

const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { paymentMethod, shippingAddress, voucherCode } = req.body;
    
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address) {
      return res.status(400).json({
        EC: 1,
        EM: "Thiếu thông tin địa chỉ giao hàng",
        DT: ""
      });
    }

    const response = await orderService.createOrder(userId, { paymentMethod, shippingAddress, voucherCode });
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

const getAllOrdersAdmin = async (req, res) => {
  try {
    const response = await orderService.getAllOrders();
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EC: -1,
      EM: "Loi server",
      DT: ""
    });
  }
};

const getOrderDetailAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({
        EC: 1,
        EM: "Thieu orderId",
        DT: ""
      });
    }

    const response = await orderService.getOrderByIdAdmin(orderId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EC: -1,
      EM: "Loi server",
      DT: ""
    });
  }
};

const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        EC: 1,
        EM: "Thieu orderId hoac status",
        DT: ""
      });
    }

    const response = await orderService.updateOrderStatus(orderId, status, note || "");
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EC: -1,
      EM: "Loi server",
      DT: ""
    });
  }
};

const updateOrderPaymentStatusAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    if (!orderId || typeof paymentStatus !== "boolean") {
      return res.status(400).json({
        EC: 1,
        EM: "Thieu orderId hoac paymentStatus",
        DT: ""
      });
    }

    const response = await orderService.updateOrderPaymentStatus(orderId, paymentStatus);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EC: -1,
      EM: "Loi server",
      DT: ""
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderDetail,
  cancelOrder,
  getAllOrdersAdmin,
  getOrderDetailAdmin,
  updateOrderStatusAdmin,
  updateOrderPaymentStatusAdmin
};
