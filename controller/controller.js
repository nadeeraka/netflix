const { validationResult } = require("express-validator/check");
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const Secret = require("../util/secret");

exports.getHome = (req, res, next) => {
  console.log(req.session.auth);

  // console.log(auth);
  res
    .status(200)
    .render("index", { auth: req.body.session, user: req.body.user });
};
exports.getSignin = (req, res, next) => {
  res.status(200).render("signin", { errors: false, auth: req.body.session });
};
exports.getSignup = (req, res, next) => {
  res.status(200).render("signup", { errors: false, auth: req.body.session });
};

//post
exports.postSignin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let tempError = false;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());

    return res.status(422).render("signin", {
      errors: errors.array(),
      errorMsg: errors.array()[0].msg
    });
  }
  // find user by email

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).render("signin", {
          errors: true,
          errorMsg: "invalid email or password"
        });
      }
      // compare the password
      bcrypt
        .compare(password, user.password)
        .then(match => {
          if (!match) {
            return res.status(422).render("signin", {
              errors: true,
              errorMsg: "invalid email or password"
            });
          }
          // set the session
          req.session.isLogin = true;
          req.session.user = user;
          req.res.status(200).render("index", {
            errors: false,
            auth: req.body.session,
            user: req.body.user
          });
        })
        .catch(err => {});
    })
    .catch(err => {});
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const cpassword = req.body.cpassword;

  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("signup", {
      errors: true,
      errorMsg: errors.array()[0].msg
    });
  }

  // save the user and encrypt the password

  bcrypt
    .hash(password, 12)
    .then(result => {
      const newUser = new User({
        name: name,
        email: email,
        password: result
      })
        .save()
        .then(result => {
          console.log(result);
        })
        .catch(err => {});
      console.error(err);
    })
    .catch(err => {
      console.error(err);
    });
  // ! set session
  req.session.auth = true;
  res.status(200).render("index", {
    title: "Welcome",
    errors: false,

    user: req.body.user
  });
};
