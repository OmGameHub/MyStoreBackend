const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { updateStock } = require("../controllers/product");
const {
  getOrderById,
  createOrder,
  getAllOrders,
} = require("../controllers/order");

// params
router.param("userId", getUserById);
router.param("orderId", getOrderById);

// @type    POST
// @route   /api/order/create/:userId
// @desc    route for create new order
// @access  PRIVATE
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
);

// @type    GET
// @route   /api/order/all/:userId
// @desc    route for get all order
// @access  PRIVATE
router.get(
  "/order/all/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrders
);

module.exports = router;
