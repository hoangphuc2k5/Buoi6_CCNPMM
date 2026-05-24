const cartService = require("../services/cartService");

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const response = await cartService.getCartByUserId(userId);
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

const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        EC: 1,
        EM: "Thiếu productId",
        DT: ""
      });
    }

    const response = await cartService.addItemToCart(userId, productId, quantity || 1);
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

const updateCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    
    if (!productId || !quantity) {
      return res.status(400).json({
        EC: 1,
        EM: "Thiếu productId hoặc quantity",
        DT: ""
      });
    }

    const response = await cartService.updateCartItem(userId, productId, quantity);
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

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    
    if (!productId) {
      return res.status(400).json({
        EC: 1,
        EM: "Thiếu productId",
        DT: ""
      });
    }

    const response = await cartService.removeItemFromCart(userId, productId);
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

const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const response = await cartService.clearCart(userId);
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
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart
};
