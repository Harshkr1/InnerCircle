const express = require("express");
const messageRouter = express.Router();
const { showSignUpForm, createNewUser, showLoginPage, logIn, showIndexPage, logOut, showUpdateMemberShipForm, updateMembershipStatus } = require("../controller/indexController.js");
const { showAddMessagePage, addNewMessage, deleteMessage, showUpdateMessagePage, updateMessage } = require("../controller/messageController.js");

messageRouter.get("/add-message", showAddMessagePage);
messageRouter.post("/add-message", addNewMessage);

messageRouter.get("/delete", deleteMessage);

messageRouter.get("/update-message", showUpdateMessagePage);
messageRouter.post("/update-message", updateMessage);

module.exports = {
    messageRouter,
}