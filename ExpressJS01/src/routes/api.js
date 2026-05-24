const express = require('express');
const {
    createUser,
    handleLogin,
    getUser,
    getAccount,
    forgotPassword
} = require('../controllers/userController');
const {
    getProducts,
    getProductDetail,
    createProduct
} = require('../controllers/productController');
const { getCategories, createCategory } = require('../controllers/categoryController');
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
    cancelOrder
} = require('../controllers/orderController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

const routerAPI = express.Router();

routerAPI.all("*", auth);

routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api")
})

routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.post("/forgot-password", forgotPassword);

routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

routerAPI.get("/products", getProducts);
routerAPI.get("/products/:id", getProductDetail);
routerAPI.post("/products", createProduct);
routerAPI.get("/categories", getCategories);
routerAPI.post("/categories", createCategory);

routerAPI.get("/cart", getCart);
routerAPI.post("/cart", addToCart);
routerAPI.put("/cart", updateCart);
routerAPI.delete("/cart/:productId", removeFromCart);
routerAPI.delete("/cart", clearCart);

routerAPI.post("/orders", createOrder);
routerAPI.get("/orders", getOrders);
routerAPI.get("/orders/:orderId", getOrderDetail);
routerAPI.post("/orders/:orderId/cancel", cancelOrder);

module.exports = routerAPI; //export default
