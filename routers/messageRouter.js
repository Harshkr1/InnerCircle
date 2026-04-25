const express = require("express");
const messageRouter = express.Router();
const { showAddMessagePage, addNewMessage, deleteMessage, showUpdateMessagePage, updateMessage,isRouteAuthenticated} = require("../controller/messageController.js");

messageRouter.use(isRouteAuthenticated);

messageRouter.get("/add-message", showAddMessagePage);
messageRouter.post("/add-message", addNewMessage);

messageRouter.get("/delete", deleteMessage);

messageRouter.get("/update-message", showUpdateMessagePage);
messageRouter.post("/update-message", updateMessage);

module.exports = {
    messageRouter,
}