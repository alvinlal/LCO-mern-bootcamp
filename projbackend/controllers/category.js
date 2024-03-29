const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findOne({ _id: id }).exec((err, category) => {
    if (err || !category) {
      return res.status(401).json({
        error: "Category not found!",
      });
    }
    req.category = category;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err || !category) {
      return res.status(401).json({
        error: "Category can't be created",
      });
    }
    res.json(category);
  });
};

exports.getCategory = (req, res) => {
  return red.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err || !categories) {
      return res.status(401).json({
        error: "categories not found!",
      });
    }
    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  category.save((err, updatedCategory) => {
    if (err || !updatedCategory) {
      return res.status(400).json({
        error: "Can't update category",
      });
    }
    return res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;
  category.remove((err, removedCategory) => {
    if (err || !removedCategory) {
      return res.status(400).json({
        error: `Unable to remove category ${removedCategory.name}`,
      });
    }
    res.json({
      message: `Successfully removed category ${removedCategory.name}`,
    });
  });
};
