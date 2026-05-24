const Voucher = require("../models/voucher");

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

module.exports = {
  getVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher
};
