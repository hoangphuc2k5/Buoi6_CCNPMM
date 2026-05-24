const Category = require("../models/category");

const getCategoriesService = async () => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    return categories;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const createCategoryService = async (categoryData) => {
  try {
    const category = new Category(categoryData);
    await category.save();
    return category;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateCategoryService = async (categoryId, categoryData) => {
  try {
    const category = await Category.findByIdAndUpdate(
      categoryId,
      categoryData,
      { new: true }
    );
    return category;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const deleteCategoryService = async (categoryId) => {
  try {
    const category = await Category.findByIdAndDelete(categoryId);
    return category;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  getCategoriesService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService
};
