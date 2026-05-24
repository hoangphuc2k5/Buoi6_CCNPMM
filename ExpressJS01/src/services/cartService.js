const Cart = require("../models/cart");
const Product = require("../models/product");

const getCartByUserId = async (userId) => {
  try {
    let cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      await cart.save();
    }
    return {
      EC: 0,
      EM: "Lấy giỏ hàng thành công",
      DT: cart
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

const addItemToCart = async (userId, productId, quantity = 1) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return {
        EC: 1,
        EM: "Sản phẩm không tồn tại",
        DT: ""
      };
    }

    if (product.stock < quantity) {
      return {
        EC: 2,
        EM: "Số lượng sản phẩm không đủ",
        DT: ""
      };
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (product.stock < newQuantity) {
        return {
          EC: 2,
          EM: "Số lượng sản phẩm không đủ",
          DT: ""
        };
      }
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity,
        price: product.discountPercent > 0 
          ? product.price * (1 - product.discountPercent / 100) 
          : product.price
      });
    }

    await cart.save();
    await cart.populate("items.product");

    return {
      EC: 0,
      EM: "Thêm sản phẩm vào giỏ hàng thành công",
      DT: cart
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

const updateCartItem = async (userId, productId, quantity) => {
  try {
    if (quantity < 1) {
      return {
        EC: 1,
        EM: "Số lượng phải lớn hơn 0",
        DT: ""
      };
    }

    const product = await Product.findById(productId);
    if (!product) {
      return {
        EC: 2,
        EM: "Sản phẩm không tồn tại",
        DT: ""
      };
    }

    if (product.stock < quantity) {
      return {
        EC: 3,
        EM: "Số lượng sản phẩm không đủ",
        DT: ""
      };
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return {
        EC: 4,
        EM: "Giỏ hàng không tồn tại",
        DT: ""
      };
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return {
        EC: 5,
        EM: "Sản phẩm không có trong giỏ hàng",
        DT: ""
      };
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate("items.product");

    return {
      EC: 0,
      EM: "Cập nhật giỏ hàng thành công",
      DT: cart
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

const removeItemFromCart = async (userId, productId) => {
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return {
        EC: 1,
        EM: "Giỏ hàng không tồn tại",
        DT: ""
      };
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.product");

    return {
      EC: 0,
      EM: "Xóa sản phẩm khỏi giỏ hàng thành công",
      DT: cart
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

const clearCart = async (userId) => {
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return {
        EC: 1,
        EM: "Giỏ hàng không tồn tại",
        DT: ""
      };
    }

    cart.items = [];
    await cart.save();

    return {
      EC: 0,
      EM: "Xóa giỏ hàng thành công",
      DT: cart
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
  getCartByUserId,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart
};
