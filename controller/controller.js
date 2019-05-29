const { validationResult } = require("express-validator/check");
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const Secret = require("../util/secret");
const SESSION_NAME = "sid";

exports.getHome = (req, res, next) => {
  console.log(req.session.auth);

  console.log(req.session.user);
  res.status(200).render("index", {
    user: req.session.user,
    auth: req.session.auth,
    name: req.session.name
  });
};
exports.getSignin = (req, res, next) => {
  console.log(req.session.user);
  console.log(req.session.name);
  res.status(200).render("signin", {
    errors: false,
    user: req.session.user,
    auth: req.session.auth,
    name: req.session.name
  });
};
exports.logout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      console.log("unabale to distroy session):");
    }
    res.clearCookie(SESSION_NAME).render("signin");
  });
};
exports.getSignup = (req, res, next) => {
  console.log(req.session.user);
  console.log(req.session.name);

  res.status(200).render("signup", {
    errors: false,
    user: req.session.user,
    auth: req.session.auth,
    name: req.session.name
  });
};
exports.watch = (req, res, next) => {
  console.log(req.session.user);
  console.log(req.session.name);

  res.redirect("www.google.com");
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
          console.log(user);
          req.session.auth = true;
          req.session.user = user._id;
          req.session.name = user.name;
          req.res.status(200).render("index", {
            errors: false,
            user: req.session.user,
            auth: req.session.auth,
            name: req.session.name
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
        .then(user => {
          // user = req.session.user;
          console.log(user);
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
    errors: false
  });
};
