const secretDB = require("../../util/secret");

if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI: secretDB
  };
} else {
  module.exports = {
    mongoURI: "mongodb://localhost/netflix"
  };
}
