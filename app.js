const express = require("express");
const app = express();
const basicRouter = require("./routes/basicRotes");
const path = require("path");
const db = require("./database/db");
const bodyParser = require("body-parser");

// allow public content
app.use(express.static(path.join(__dirname, "public")));

//body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// ejs
app.set("view engine", "ejs");
app.set("views", "views");

// routes
app.use(basicRouter);

//db connection
const port = process.env.port || 8080;

app.listen(port, () => {
  console.log(`App listening on port ${port} !`);
});
