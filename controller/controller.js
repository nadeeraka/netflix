const { validationResult } = require("express-validator/check");
const User = require("../models/users");
const bcrypt = require("bcryptjs");
exports.getHome = (req, res, next) => {
  res.status(200).render("index");
};
exports.getSignin = (req, res, next) => {
  res.status(200).render("signin", { errors: false });
};
exports.getSignup = (req, res, next) => {
  res.status(200).render("signup", { errors: false });
};

// exports.signup = (req, res, next) => {
//   const name = req.body.name;
//   const email = req.body.email;
//   const password = req.body.password;
//   const cpassword = req.body.cpassword;

//   const errors = validationResult(req);
//   console.log(errors.array());
//   if (!errors.isEmpty()) {
//     console.log(errors.array());
//     res.status(422).render("signup", {
//       errors: true,
//       errorMsg: errors.array()[0].msg
//     });
//   }

//   res.status(200).render("index", { title: "Welcome", errors: false });
// };

//post
exports.postSignin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("signin", {
      errors: errors.array(),
      errorMsg: errors.array()[0].msg
    });
  }

  res.status(200).render("index", { errors: false });
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

  res.status(200).render("index", { title: "Welcome", errors: false });
};
