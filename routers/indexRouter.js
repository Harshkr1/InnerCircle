const express = require("express");
const indexRouter = express.Router();
const { showSignUpForm, createNewUser, showLoginPage, logIn, showIndexPage, logOut, showAddMessagePage, addNewMessage, showUpdateMemberShipForm, updateMembershipStatus, deleteMessage,showUpdateMessagePage,updateMessage } = require("../controller/indexController.js");
const { customValidator } = require("../controller/formValidator.js");
const passport = require("passport");

indexRouter.get("/", showIndexPage);

indexRouter.get("/sign-up", showSignUpForm);
indexRouter.post("/sign-up", customValidator /* custom validator middleware for validating the form field */, createNewUser);

indexRouter.get("/log-in", showLoginPage);
indexRouter.post("/log-in", logIn);

indexRouter.get("/log-out", logOut);

indexRouter.get("/add-message", showAddMessagePage);
indexRouter.post("/add-message", addNewMessage);

indexRouter.get("/update-membership", showUpdateMemberShipForm);
indexRouter.post("/update-membership", updateMembershipStatus);

indexRouter.get("/delete", deleteMessage);

indexRouter.get("/update-message", showUpdateMessagePage);
indexRouter.post("/update-message", updateMessage);

module.exports = {
    indexRouter,
}