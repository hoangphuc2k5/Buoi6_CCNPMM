const express = require('express');
const {
    createUser,
    handleLogin,
    getUser,
    getAccount,
    forgotPassword,
    verifyForgotPasswordOtp,
    resetPassword,
    getUserDetail,
    updateUserLock
} = require('../controllers/userController');
const {
    getProducts,
    getProductDetail,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const {
    getCart,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart
} = require('../controllers/cartController');
const {
    createOrder,
    getOrders,
    getOrderDetail,
    cancelOrder,
    getAllOrdersAdmin,
    getOrderDetailAdmin,
    updateOrderStatusAdmin,
    updateOrderPaymentStatusAdmin
} = require('../controllers/orderController');
const { getDashboardStats } = require('../controllers/adminController');
const { getVouchers, createVoucher, updateVoucher, deleteVoucher, validateVoucher } = require('../controllers/voucherController');
const { getReviews, approveReview, deleteReview } = require('../controllers/reviewController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const delay = require('../middleware/delay');

const routerAPI = express.Router();

routerAPI.all("*", auth);

routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api")
})

routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.post("/forgot-password", forgotPassword);
routerAPI.post("/forgot-password/verify", verifyForgotPasswordOtp);
routerAPI.post("/forgot-password/reset", resetPassword);

routerAPI.get("/user", admin, getUser);
routerAPI.get("/account", delay, getAccount);

routerAPI.get("/products", getProducts);
routerAPI.get("/products/:id", getProductDetail);
routerAPI.post("/products", admin, createProduct);
routerAPI.get("/categories", getCategories);
routerAPI.post("/categories", admin, createCategory);

routerAPI.get("/cart", getCart);
routerAPI.post("/cart", addToCart);
routerAPI.put("/cart", updateCart);
routerAPI.delete("/cart/:productId", removeFromCart);
routerAPI.delete("/cart", clearCart);

routerAPI.post("/orders", createOrder);
routerAPI.get("/orders", getOrders);
routerAPI.get("/orders/:orderId", getOrderDetail);
routerAPI.post("/orders/:orderId/cancel", cancelOrder);

// Admin routes
routerAPI.get("/admin/dashboard", admin, getDashboardStats);

routerAPI.put("/admin/products/:id", admin, updateProduct);
routerAPI.delete("/admin/products/:id", admin, deleteProduct);

routerAPI.put("/admin/categories/:id", admin, updateCategory);
routerAPI.delete("/admin/categories/:id", admin, deleteCategory);

routerAPI.get("/admin/orders", admin, getAllOrdersAdmin);
routerAPI.get("/admin/orders/:orderId", admin, getOrderDetailAdmin);
routerAPI.put("/admin/orders/:orderId/status", admin, updateOrderStatusAdmin);
routerAPI.put("/admin/orders/:orderId/payment", admin, updateOrderPaymentStatusAdmin);

routerAPI.get("/admin/users", admin, getUser);
routerAPI.get("/admin/users/:userId", admin, getUserDetail);
routerAPI.put("/admin/users/:userId/lock", admin, updateUserLock);

routerAPI.get("/admin/vouchers", admin, getVouchers);
routerAPI.post("/admin/vouchers", admin, createVoucher);
routerAPI.put("/admin/vouchers/:id", admin, updateVoucher);
routerAPI.delete("/admin/vouchers/:id", admin, deleteVoucher);

routerAPI.post("/vouchers/validate", validateVoucher);

routerAPI.get("/admin/reviews", admin, getReviews);
routerAPI.put("/admin/reviews/:id/approve", admin, approveReview);
routerAPI.delete("/admin/reviews/:id", admin, deleteReview);

module.exports = routerAPI; //export default
