const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { signup, signIn, signOut, isSignedIn } = require("../controllers/auth");

// @type    POST
// @route   /api/signup
// @desc    route for registration/sign up user
// @access  PUBLIC
router.post(
  "/signup",
  [
    check("name", "name should be at least 3 char").isLength({ min: 3 }),
    check("email", "email is required").isLength({ min: 1 }),
    check("email", "invalid email").isEmail(),
    check("password", "password should be at least 5 char").isLength({
      min: 5,
    }),
  ],
  signup
);

// @type    POST
// @route   /api/signin
// @desc    route for sign in user
// @access  PUBLIC
router.post(
  "/signin",
  [
    check("email", "email is required").isLength({ min: 1 }),
    check("email", "invalid email").isEmail(),
    check("password", "password is required").isLength({ min: 1 }),
  ],
  signIn
);

// @type    GET
// @route   /api/signout
// @desc    route for sign out user
// @access  PUBLIC
router.get("/signout", signOut);

// @type    GET
// @route   /api/testroute
// @desc    route for sign out user
// @access  PUBLIC
router.get("/testroute", isSignedIn, (req, res) => {
  res.send("A protected route");
});

module.exports = router;
