const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const { check, body } = require("express-validator/check");
const User = require("../models/users");

router.get("/", controller.getHome);
router.get("/signin", controller.getSignin);
router.get("/signup", controller.getSignup);
router.get("/logout", controller.logout);

//post
router.post(
  "/signin",
  body("email")
    .trim()
    .withMessage("Don't add white space")
    .escape()
    .withMessage("escape")
    .isEmail()
    .withMessage("Not valid email")
    .custom((value, { req }) => {
      if (value === "test@test.com") {
        throw new Error("this email is forbidden ");
      }

      return true;
    })
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(result => {
        if (!result) {
          throw new Error(" First you may need to Signup ");
        }
      });
    }),
  body("password")
    .not()
    .isEmail()
    .trim()
    .escape()
    .isAlphanumeric()
    .withMessage("please use text and numbers for password")
    .isLength({ min: 3 })

    .isLength({ max: 20 }),

  controller.postSignin
);
router.post(
  "/signup",

  body("name")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .isAlphanumeric()
    .withMessage("please enter some valid user name")
    .isLength({ min: 3 })
    .withMessage("Opps!  user name too short")
    .isLength({ max: 20 })
    .withMessage("Opps!  user name too long"),
  body("email")
    .trim()
    .escape()
    .isEmail()
    .withMessage("please enter some valid email")

    .custom((value, { req }) => {
      if (value === "test@test.com") {
        throw new Error("this email is forbidden ");
      }
      return true;
    })
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(result => {
        if (result) {
          return Promise.reject("email already use");
        }
      });
    }),
  body("password")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .isAlphanumeric()
    .withMessage("please use text and numbers for password")
    .isLength({ min: 3 })
    .withMessage("Opps!  password too short")
    .isLength({ max: 20 })
    .withMessage("Opps!  password too long "),
  body("cpassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password have to match !");
    }
    return true;
  }),

  controller.postSignup
);
// ! 404 not found

router.use((req, res, next) => {
  res.status(404).render("404");
});

module.exports = router;
