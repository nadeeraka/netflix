const mongoose = require("mongoose");
const drive = require("../config/db/dbconfig");
const connect = async () => {
  try {
    const aws = await mongoose.connect(drive.mongoURI, {
      useNewUrlParser: true
    });

    if (aws) {
      console.log("connect !");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = connect;
