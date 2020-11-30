const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);

  // if error then send error message & param
  if (!errors.isEmpty()) {
    const error = errors.array()[0];
    return res.status(422).json({
      error: error.msg,
      param: error.param,
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "Not able to save user in DB",
      });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  });
};

exports.signIn = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  // if error then send error message & param
  if (!errors.isEmpty()) {
    const error = errors.array()[0];
    return res.status(422).json({
      error: error.msg,
      param: error.param,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User email does not exist",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password no not match",
      });
    }

    // create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    // put token in cookie
    res.cookie("token", token, { expire: new Date() + 999 });

    // send response to front end
    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: {
        _id,
        name,
        email,
        role,
      },
    });
  });
};

exports.signOut = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "user sign out successfully",
  });
};

// protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

// custom middleware
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }

  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }

  next();
};
