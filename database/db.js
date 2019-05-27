const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/netflix", { useNewUrlParser: true })
  .then(result => {
    console.log("connected");
  })
  .catch(err => {
    console.error(err);
  });
