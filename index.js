const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

// import all routes
const auth = require("./routes/api/auth");
const profile = require("./routes/api/profile");
const quest = require("./routes/api/quest");

const app = express();

var port = process.env.PORT || 3000;

// middleware for bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// mongodb comfiguration
const db = require("./setup/myurl").mongourl;

// attempt to connect to database
mongoose
  .connect(db)
  .then(() => console.log("mongodb connected successfully"))
  .catch(err => console.log(err));

// passport middleware
app.use(passport.initialize());

// configure jwt strategy
require("./strategies/jwtstrategy")(passport);

//this is testing route
app.get("/", (req, res) => {
  res.send("hello");
});

// actual rotes
app.use("/api/auth", auth);
app.use("/api/profile", profile);
app.use("/api/quest", quest);

app.listen(port, () => {
  console.log(`server is running at ${port}`);
});
