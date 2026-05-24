const {
  getCategoriesService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService
} = require("../services/categoryService");

const getCategories = async (req, res) => {
  const data = await getCategoriesService();
  if (!data) {
    return res.status(500).json({ message: "Khong the lay danh muc." });
  }
  return res.status(200).json({ data });
};

const createCategory = async (req, res) => {
  console.log("Creating category with data:", req.body);
  const category = await createCategoryService(req.body);
  if (!category) {
    console.log("Failed to create category!");
    return res.status(500).json({ message: "Khong the tao danh muc." });
  }
  console.log("Category created successfully:", category);
  return res.status(201).json({ data: category, message: "Tao danh muc thanh cong!" });
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const category = await updateCategoryService(id, req.body);
  if (!category) {
    return res.status(404).json({ message: "Khong tim thay danh muc." });
  }
  return res.status(200).json({ data: category, message: "Cap nhat danh muc thanh cong!" });
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const category = await deleteCategoryService(id);
  if (!category) {
    return res.status(404).json({ message: "Khong tim thay danh muc." });
  }
  return res.status(200).json({ data: category, message: "Xoa danh muc thanh cong!" });
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
