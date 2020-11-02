const express = require("express");
const router = express.Router();

const {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  removeCategory,
} = require("../controllers/category");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

// @type    POST
// @route   /api/category/create/:userId
// @desc    route for create new category
// @access  PRIVATE
router.post(
  "/category/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCategory
);

// @type    GET
// @route   /api/category/:categoryId
// @desc    route for get category
// @access  PUBLIC
router.get("/category/:categoryId", getCategory);

// @type    GET
// @route   /api/categories/
// @desc    route for get all categories
// @access  PUBLIC
router.get("/categories", getAllCategories);

// @type    PUT
// @route   /api/category/:categoryId/:userId
// @desc    route for update category
// @access  PRIVATE
router.put(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);

// @type    DELETE
// @route   /api/category/:categoryId/:userId
// @desc    route for remove category
// @access  PRIVATE
router.delete(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeCategory
);

module.exports = router;
