const express = require("express");
const app = express();
const basicRouter = require("./routes/basicRotes");
const path = require("path");
// ejs
app.set("view engine", "ejs");
app.set("views", "views");

// routes
app.use(basicRouter);

// allow public content
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.port || 8080;

app.listen(port, () => {
  console.log(`App listening on port ${port} !`);
});
