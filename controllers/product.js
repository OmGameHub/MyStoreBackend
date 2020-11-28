const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          msg: "Product not found in DB",
        });
      }

      req.product = product;
      next();
    });
};

exports.updateStock = (req, res, next) => {
  let bulkOpProducts = req.body.order.products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: {
          $inc: { stock: -product.count, sold: +product.count },
        },
      },
    };
  });

  Product.bulkWrite(bulkOpProducts, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        msg: "Failed to perform bulk operation",
      });
    }

    next();
  });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        msg: "Problem with image",
      });
    }

    const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        msg: "All fields are required",
      });
    }

    let product = new Product(fields);

    // handel file here
    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status(400).json({
          msg: "File size is too big",
        });
      }

      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, product) => {
      if (err || !product) {
        res.status(400).json({
          msg: "Failed to save product into DB",
        });
      }

      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    res.send(req.product.photo.data);
  }

  next();
};

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let sortOrder = req.query.sortOrder ? req.query.sortOrder : "asc";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, sortOrder]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          msg: "No Product found",
        });
      }

      return res.json(products);
    });
};

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        msg: "Problem with image",
      });
    }

    let product = req.product;
    product = _.extend(product, fields);

    // handel file here
    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status(400).json({
          msg: "File size is too big",
        });
      }

      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, product) => {
      if (err || !product) {
        res.status(400).json({
          msg: "Failed to update product into DB",
        });
      }

      res.json(product);
    });
  });
};

exports.removeProduct = (req, res) => {
  let product = req.product;

  product.remove((err, removeProduct) => {
    if (err) {
      return res.status(400).json({
        msg: `Failed to delete the product`,
      });
    }

    return res.json({
      msg: `Successfully deleted the product`,
      removeProduct,
    });
  });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        msg: "No category found",
      });
    }

    res.json(categories);
  });
};
