const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const {
  getProductById,
  createProduct,
  getProduct,
  photo,
  getAllProducts,
  removeProduct,
  updateProduct,
  getAllUniqueCategories,
} = require("../controllers/product");

// params
router.param("userId", getUserById);
router.param("productId", getProductById);

// @type    POST
// @route   /api/product/create/:userId
// @desc    route for create/add new product
// @access  PRIVATE
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

// @type    GET
// @route   /api/product/:productId
// @desc    route for get product
// @access  PUBLIC
router.get("/product/:productId", getProduct);

// @type    GET
// @route   /api/product/photo/:productId
// @desc    route for get product photo
// @access  PUBLIC
router.get("/product/photo/:productId", photo);

// @type    GET
// @route   /api/products
// @desc    route for get all products
// @access  PUBLIC
router.get("/products", getAllProducts);

// @type    PUT
// @route   /api/product/:productId/:userId
// @desc    route for update product
// @access  PRIVATE
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

// @type    DELETE
// @route   /api/product/:productId/:userId
// @desc    route for delete/remove product
// @access  PRIVATE
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeProduct
);

// @type    GET
// @route   /api/products/categories
// @desc    route for get all unique categories
// @access  PUBLIC
router.get("/products/categories", getAllUniqueCategories);

module.exports = router;
