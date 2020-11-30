const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Category not found in DB",
      });
    }

    req.category = category;
    next();
  });
};

exports.createCategory = (req, res) => {
  const newCategory = new Category(req.body);
  newCategory.save((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Failed to save category into DB",
      });
    }

    res.json({ category });
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategories = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err || !categories) {
      return res.status(400).json({
        error: "No Categories found",
      });
    }

    return res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;

  category.save((err, updatedCategory) => {
    if (err || !updatedCategory) {
      return res.status(400).json({
        error: "Failed to update category into DB",
      });
    }

    return res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;

  category.remove((err, removeCategory) => {
    if (err || !removeCategory) {
      return res.status(400).json({
        error: `Failed to remove category`,
      });
    }

    return res.json({
      message: `Successfully deleted ${removeCategory.name} category`,
    });
  });
};
