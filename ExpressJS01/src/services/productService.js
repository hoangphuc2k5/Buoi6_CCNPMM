const Product = require("../models/product");
const Category = require("../models/category");

const buildSort = (sort) => {
  if (sort === "price-asc") return { price: 1 };
  if (sort === "price-desc") return { price: -1 };
  if (sort === "newest") return { createdAt: -1 };
  if (sort === "best-seller") return { sold: -1 };
  if (sort === "most-viewed") return { views: -1 };
  if (sort === "rating") return { rating: -1 };
  return { createdAt: -1 };
};

const parseNumber = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return null;
  return parsed;
};

const getProductsService = async (query) => {
  try {
    const {
      search,
      categoryId,
      categorySlug,
      minPrice,
      maxPrice,
      inStock,
      isPromo,
      isNewProduct,
      isBestSeller,
      sort,
      page = 1,
      limit = 12
    } = query;

    const filter = {};

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { description: regex }];
    }

    if (categoryId) {
      filter.category = categoryId;
    }

    if (categorySlug && !categoryId) {
      const category = await Category.findOne({ slug: categorySlug }).select(
        "_id"
      );
      if (!category) {
        return {
          data: [],
          meta: { total: 0, page: Number(page), limit: Number(limit) }
        };
      }
      filter.category = category._id;
    }

    const min = parseNumber(minPrice);
    const max = parseNumber(maxPrice);
    if (min !== null || max !== null) {
      filter.price = {};
      if (min !== null) filter.price.$gte = min;
      if (max !== null) filter.price.$lte = max;
    }

    if (inStock === "true") {
      filter.stock = { $gt: 0 };
    }

    if (isPromo === "true") {
      filter.isPromo = true;
    }

    if (isNewProduct === "true") {
      filter.isNewProduct = true;
    }

    if (isBestSeller === "true") {
      filter.isBestSeller = true;
    }

    const safeLimit = Math.max(Number(limit) || 12, 1);
    const safePage = Math.max(Number(page) || 1, 1);
    const skip = (safePage - 1) * safeLimit;

    const [total, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
        .populate("category", "name slug")
        .sort(buildSort(sort))
        .skip(skip)
        .limit(safeLimit)
    ]);

    return {
      data: products,
      meta: {
        total,
        page: safePage,
        limit: safeLimit
      }
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getProductDetailService = async (productId) => {
  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("category", "name slug");
    return product;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const createProductService = async (productData) => {
  try {
    const product = new Product(productData);
    await product.save();
    await product.populate("category", "name slug");
    return product;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  getProductsService,
  getProductDetailService,
  createProductService
};
