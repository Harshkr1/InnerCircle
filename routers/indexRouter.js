const express = require("express");
const indexRouter = express.Router();
const { showSignUpForm, createNewUser } = require("../controller/indexController.js");
const { customValidator } = require("../controller/formValidator.js");

indexRouter.get("/", (req, res) => {
    res.send("HELLO PAGES IN CONSTRUCTION");
})

indexRouter.get("/sign-up", showSignUpForm);
indexRouter.post("/sign-up", customValidator /* custom validator middleware for validating the form field */, createNewUser);


module.exports = {
    indexRouter,
}