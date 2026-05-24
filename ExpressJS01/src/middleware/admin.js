const adminOnly = (req, res, next) => {
  if (req?.user?.isAdmin) {
    return next();
  }

  return res.status(403).json({
    EC: 403,
    EM: "Khong co quyen truy cap",
    DT: ""
  });
};

module.exports = adminOnly;
