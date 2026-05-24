const { Order, ORDER_STATUS } = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

const getDashboardStats = async (req, res) => {
  try {
    const [totalOrders, totalProducts, totalUsers] = await Promise.all([
      Order.countDocuments({}),
      Product.countDocuments({}),
      User.countDocuments({ isAdmin: false })
    ]);

    const revenueAgg = await Order.aggregate([
      { $match: { status: ORDER_STATUS.DELIVERED } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    return res.status(200).json({
      EC: 0,
      EM: "Lay thong ke thanh cong",
      DT: {
        totalOrders,
        totalRevenue,
        totalProducts,
        totalUsers
      }
    });
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
  getDashboardStats
};
