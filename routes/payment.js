const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const {
  makeStripePayment,
  getBrainTreeToken,
  processBrainTreePayment,
} = require("../controllers/payment");

// params
router.param("userId", getUserById);

// @type    POST
// @route   /api/payment/stripe
// @desc    route for stripe payment
// @access  PRIVATE
router.post("/payment/stripe", makeStripePayment);

// @type    GET
// @route   /api/payment/braintree/gettoken/:userId
// @desc    route for get token for payment
// @access  PRIVATE
router.get(
  "/payment/braintree/gettoken/:userId",
  isSignedIn,
  isAuthenticated,
  getBrainTreeToken
);

// @type    POST
// @route   /api/payment/braintree/:userId
// @desc    route for braintree process payment
// @access  PRIVATE
router.post(
  "/payment/braintree/:userId",
  isSignedIn,
  isAuthenticated,
  processBrainTreePayment
);

module.exports = router;
