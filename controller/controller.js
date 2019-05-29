const { validationResult } = require("express-validator/check");
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const Secret = require("../util/secret");
const SESSION_NAME = "sid";
const Massage = require("../temp/mail");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const secret = require("../util/secret");

// mail config
const transporter = nodemailer.createTransport(
  sendgrid({
    auth: {
      api_user: "nadeeraka",
      api_key: secret.api_key
    }
  })
);

//  ! get /
exports.getHome = (req, res, next) => {
  console.log(req.session.auth);

  console.log(req.session.user);
  res.status(200).render("index", {
    user: req.session.user,
    auth: req.session.auth,
    name: req.session.name
  });
};
//  ! get signin
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

//  ! logout

exports.logout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      console.log("unabale to distroy session):");
    }
    res.clearCookie(SESSION_NAME).render("signin");
  });
};
// ! get signup

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

// ! watch

exports.watch = (req, res, next) => {
  console.log(req.session.user);
  console.log(req.session.name);

  res.redirect("www.google.com");
};

// !post routs

// ! post sign in

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
          // send email
          transporter.sendMail({
            from: "netflix@netflixpro.com",
            to: user.email,
            subject: "Conform user",
            text: "For clients with plaintext support only",
            html:
              "<p>For clients that do not support AMP4EMAIL or amp content is not valid</p>",
            amp: `<!doctype html>
    <html ⚡4email>
      <head>
        <meta charset="utf-8">
        <style amp4email-boilerplate>body{visibility:hidden}</style>
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
      </head>
      <body>
        <p>Image: <amp-img src="https://cldup.com/P0b1bUmEet.png" width="16" height="16"/></p>
        <p>GIF (requires "amp-anim" script in header):<br/>
          <amp-anim src="https://cldup.com/D72zpdwI-i.gif" width="500" height="350"/></p>
      </body>
    </html>`
          });

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

          // set the session
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.error(err);
    });
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
    errors: false,
    user: req.session.user,
    auth: req.session.auth,
    name: req.session.name
  });
};
