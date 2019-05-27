const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).render("index");
});

router.get("/signin", (req, res, next) => {
  res.status(200).render("signin");
});
router.get("/signup", (req, res, next) => {
  res.status(200).render("signup");
});

module.exports = router;
