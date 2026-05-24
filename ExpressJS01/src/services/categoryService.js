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

module.exports = {
  getCategoriesService,
  createCategoryService
};
