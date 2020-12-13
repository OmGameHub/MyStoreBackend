const express = require("express");
const router = express.Router();

const { makeStripePayment } = require("../controllers/payment");

// @type    POST
// @route   /api/payment/stripe
// @desc    route for stripe payment
// @access  PRIVATE
router.post("/payment/stripe", makeStripePayment);

module.exports = router;
