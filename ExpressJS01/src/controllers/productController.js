const {
  getProductsService,
  getProductDetailService,
  createProductService
} = require("../services/productService");

const getProducts = async (req, res) => {
  const data = await getProductsService(req.query);
  if (!data) {
    return res.status(500).json({ message: "Khong the lay san pham." });
  }
  return res.status(200).json(data);
};

const getProductDetail = async (req, res) => {
  const { id } = req.params;
  const product = await getProductDetailService(id);
  if (!product) {
    return res.status(404).json({ message: "Khong tim thay san pham." });
  }
  return res.status(200).json({ data: product });
};

const createProduct = async (req, res) => {
  console.log("Creating product with data:", req.body);
  const product = await createProductService(req.body);
  if (!product) {
    console.log("Failed to create product!");
    return res.status(500).json({ message: "Khong the tao san pham." });
  }
  console.log("Product created successfully:", product);
  return res.status(201).json({ data: product, message: "Tao san pham thanh cong!" });
};

module.exports = {
  getProducts,
  getProductDetail,
  createProduct
};
