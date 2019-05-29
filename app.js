const express = require("express");
const app = express();
const basicRouter = require("./routes/basicRotes");
const path = require("path");
const db = require("./database/db");
const bodyParser = require("body-parser");
const session = require("express-session");
const secret = require("./util/secret");
const MongoDBStore = require("connect-mongodb-session")(session);

// custom const

const NODE_ENV = "development",
  SESSION_LIFE = 1000 * 60 * 60 * 2,
  SESSION_NAME = "sid",
  PORT = 8080;

const IN_PROD = NODE_ENV === "production";

// allow public content
app.use(express.static(path.join(__dirname, "public")));

//body-parser
app.use(bodyParser.urlencoded({ extended: false }));
// session store
const store = new MongoDBStore({
  uri: "mongodb://localhost/netflix",
  collection: "Sessions"
});

// session
//const { SESSION_NAME, SESSION_LIFE, } = custom;
app.use(
  session({
    cookie: {
      name: SESSION_NAME,
      maxAge: SESSION_LIFE,
      sameSite: true,
      secure: IN_PROD
    },
    secret: secret,
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

// ejs
app.set("view engine", "ejs");
app.set("views", "views");

// routes
app.use(basicRouter);

//db connection

if (process.env.port) {
  app.listen(process.env.port, () => {
    console.log(`App listening on port ${process.env.port} !`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT} !`);
  });
}
