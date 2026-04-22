const express = require("express");
const app = express();
const path = require("path");
const { indexRouter } = require("./routers/indexRouter.js");
const session = require("express-session");
require("dotenv").config();
const passport = require("passport");
const { CurrentLocalStrategy, currentSession } = require("./routers/auth.js");
const db = require(".//db/query");

const PORT = process.env.PORT || 3030;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// To parse data from the form we need to encode
// the data from url.
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// first make it use sessions
app.use(currentSession)
// make passport use this session created via express-session here so that inside cookies we can insert our name
app.use(passport.session());
// make passport use our localstrategy
passport.use(CurrentLocalStrategy);

// Initializing the serialize and deserialize user to make sure to store user detail in session 
// and store user Id in cookies as well to know that a particular user is related to user here 
// done callback to store the result
passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
  try {
    const  rows  = await db.findUserByID(id);
    const user = rows[0];
    done(null, user);
  } catch (error) {
    done(error);
  }
})

// To store the current user we will initialize an middleWare here 
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", indexRouter);

app.listen(PORT, (error) => {
  if (error) {
    throw new error();
  }
  console.log(`listening to port ${PORT}`);
});
