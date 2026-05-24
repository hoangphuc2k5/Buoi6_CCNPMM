const Review = require("../models/review");

const getReviews = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) {
      filter.status = status;
    }
    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .populate("product", "name")
      .populate("user", "name email");

    return res.status(200).json({
      EC: 0,
      EM: "Lay danh sach danh gia thanh cong",
      DT: reviews
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ EC: -1, EM: "Loi server", DT: "" });
  }
};

const approveReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ EC: 1, EM: "Khong tim thay danh gia", DT: "" });
    }

    return res.status(200).json({ EC: 0, EM: "Duyet danh gia thanh cong", DT: review });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ EC: -1, EM: "Loi server", DT: "" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ EC: 1, EM: "Khong tim thay danh gia", DT: "" });
    }
    return res.status(200).json({ EC: 0, EM: "Xoa danh gia thanh cong", DT: review });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ EC: -1, EM: "Loi server", DT: "" });
  }
};

module.exports = {
  getReviews,
  approveReview,
  deleteReview
};
