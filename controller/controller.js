const { validationResult } = require("express-validator/check");

exports.getHome = (req, res, next) => {
  res.status(200).render("index");
};
exports.getSignin = (req, res, next) => {
  res.status(200).render("signin");
};

exports.signup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const cpassword = req.body.cpassword;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(422)
      .render("signup", {
        errors: errors.array(),
        errorMsg: errors.array()[0].msg
      });
  }

  res.status(200).render("index", { title: "Welcome", errors: false });
};

//post
exports.postSignin = (req, res, next) => {
  res.status(200).render("signin");
};

exports.postSignup = (req, res, next) => {
  res.status(200).render("signup");
};
