const Voucher = require("../models/voucher");
const Cart = require("../models/cart");

const getVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      EC: 0,
      EM: "Lay danh sach voucher thanh cong",
      DT: vouchers
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ EC: -1, EM: "Loi server", DT: "" });
  }
};

const createVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.create(req.body);
    return res.status(201).json({
      EC: 0,
      EM: "Tao voucher thanh cong",
      DT: voucher
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ EC: -1, EM: "Loi server", DT: "" });
  }
};

const updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await Voucher.findByIdAndUpdate(id, req.body, { new: true });
    if (!voucher) {
      return res.status(404).json({ EC: 1, EM: "Khong tim thay voucher", DT: "" });
    }
    return res.status(200).json({ EC: 0, EM: "Cap nhat voucher thanh cong", DT: voucher });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ EC: -1, EM: "Loi server", DT: "" });
  }
};

const deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await Voucher.findByIdAndDelete(id);
    if (!voucher) {
      return res.status(404).json({ EC: 1, EM: "Khong tim thay voucher", DT: "" });
    }
    return res.status(200).json({ EC: 0, EM: "Xoa voucher thanh cong", DT: voucher });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ EC: -1, EM: "Loi server", DT: "" });
  }
};

const validateVoucher = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ EC: 1, EM: "Thieu ma giam gia", DT: "" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ EC: 2, EM: "Gio hang trong", DT: "" });
    }

    const voucher = await Voucher.findOne({ code: code.trim().toUpperCase() });
    const now = new Date();

    if (!voucher || !voucher.isActive) {
      return res.status(400).json({ EC: 3, EM: "Ma giam gia khong hop le", DT: "" });
    }

    if (voucher.startAt && now < voucher.startAt) {
      return res.status(400).json({ EC: 4, EM: "Ma giam gia chua den thoi gian ap dung", DT: "" });
    }

    if (voucher.endAt && now > voucher.endAt) {
      return res.status(400).json({ EC: 5, EM: "Ma giam gia da het han", DT: "" });
    }

    if (voucher.usageLimit > 0 && voucher.usedCount >= voucher.usageLimit) {
      return res.status(400).json({ EC: 6, EM: "Ma giam gia da het luot su dung", DT: "" });
    }

    if (voucher.minOrder > 0 && cart.totalPrice < voucher.minOrder) {
      return res.status(400).json({ EC: 7, EM: "Don hang chua dat gia tri toi thieu", DT: "" });
    }

    let discountAmount = 0;
    if (voucher.type === "percent") {
      discountAmount = (cart.totalPrice * voucher.value) / 100;
      if (voucher.maxDiscount > 0) {
        discountAmount = Math.min(discountAmount, voucher.maxDiscount);
      }
    } else {
      discountAmount = voucher.value;
    }

    discountAmount = Math.min(discountAmount, cart.totalPrice);
    const finalTotal = Math.max(cart.totalPrice - discountAmount, 0);

    return res.status(200).json({
      EC: 0,
      EM: "Ap dung ma giam gia thanh cong",
      DT: {
        code: voucher.code,
        discountAmount,
        originalTotal: cart.totalPrice,
        finalTotal
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ EC: -1, EM: "Loi server", DT: "" });
  }
};

module.exports = {
  getVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  validateVoucher
};
