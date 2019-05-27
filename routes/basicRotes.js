const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const { check, body } = require("express-validator/check");
const User = require("../models/users");

router.get("/", controller.getHome);
router.get("/signin", controller.getSignin);
router.get("/signup", controller.getSignup);
//post
router.post("/signin", controller.postSignin);
router.post(
  "/signup",
  check("name")
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
    .not()
    .isEmpty()
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
      User.findOne({
        email: value
      }).then(result => {
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
module.exports = router;
