const express = require("express");
const indexRouter = express.Router();
const { showSignUpForm, createNewUser, showLoginPage, logIn, showIndexPage,logOut } = require("../controller/indexController.js");
const { customValidator } = require("../controller/formValidator.js");
const passport = require("passport");

indexRouter.get("/", showIndexPage);

indexRouter.get("/sign-up", showSignUpForm);
indexRouter.post("/sign-up", customValidator /* custom validator middleware for validating the form field */, createNewUser);

indexRouter.get("/log-in", showLoginPage);
indexRouter.post("/log-in", logIn);

indexRouter.get("/log-out", logOut);

module.exports = {
    indexRouter,
}