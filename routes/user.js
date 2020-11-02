const express = require("express");
const router = express.Router();
const {
  getUserById,
  getUser,
  updateUser,
  getUserPurchaseList,
} = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

router.param("userId", getUserById);

// @type    GET
// @route   /api/user/:userId
// @desc    route for get user information
// @access  PRIVATE
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

// @type    PUT
// @route   /api/user/:userId
// @desc    route for update user information
// @access  PRIVATE
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

// @type    GET
// @route   /api/orders/user/:userId
// @desc    route for get user purchase list
// @access  PRIVATE
router.get(
  "/orders/user/:userId",
  isSignedIn,
  isAuthenticated,
  getUserPurchaseList
);

module.exports = router;
