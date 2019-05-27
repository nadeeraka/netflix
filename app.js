const express = require("express");
const app = express();
const basicRouter = require("./routes/basicRotes");
const path = require("path");
const db = require("./database/db");
// allow public content
app.use(express.static(path.join(__dirname, "public")));

// ejs
app.set("view engine", "ejs");
app.set("views", "views");

// routes
app.use(basicRouter);
//404
app.use((req, res, next) => {
  res.status(404).render("404");
});

//db connection
const port = process.env.port || 8080;

app.listen(port, () => {
  console.log(`App listening on port ${port} !`);
});
