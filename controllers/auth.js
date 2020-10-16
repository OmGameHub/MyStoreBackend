const User = require("../models/user");
const { validationResult } = require('express-validator');

exports.signup = (req, res) => {

  const errors = validationResult(req);

  // if error then send error message & param
  if (!errors.isEmpty()) {
    const error = errors.array()[0];
    return res.status(422).json({
      msg: error.msg,
      param: error.param,
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        msg: "Not able to save user in DB",
      });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });

  });
}

exports.signout = (req, res) => {
  res.json({
    message: "user signout",
  });
}
