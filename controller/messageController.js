const db = require("../db/query");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const passport = require("passport");
const { getAuthenticationStatusAndFullNameById } = require(".//indexController.js");

// addin route protection here
async function isRouteAuthenticated(request, response, next) {
    const { isAuthenticated, fullName } = await getAuthenticationStatusAndFullNameById(request, response);
    response.locals.isAuthenticated = isAuthenticated;
    response.locals.fullName = fullName;

    if (!request.isAuthenticated()) {
        return response.render("log-in", { errors: ["Please login first"], isAuthenticated: isAuthenticated, fullName: fullName });
    }
    next();
}

async function showAddMessagePage(request, response, next) {
    return response.render("add-message", { isAuthenticated: response.locals.isAuthenticated, fullName: response.locals.fullName });
}

async function addNewMessage(request, response, next) {
    try {
        const title = request.body.title;
        const message = request.body.messageText;
        const username = response.locals.currentUser.username;
        const userId = await db.findUserIdByUsername(username);
        await db.addMessage(userId, title, message, username);
        return response.redirect("/");
    } catch (error) {
        throw new Error(error);
    }
}


async function deleteMessage(request, response) {
    try {
        const messageID = request.query.messageId;
        await db.deleteMessageByID(messageID);
        return response.redirect("/");
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

async function showUpdateMessagePage(request, response) {
    try {
        const messageID = request.query.messageId;
        const message = await db.getMessageByID(messageID);
        return response.render("update-message", { messageID: messageID, fullName: response.locals.fullName, isAuthenticated: response.locals.isAuthenticated, message: message });
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

async function updateMessage(request, response) {
    try {
        const messageID = request.query.currentMessageId;
        const title = request.body.title;
        const message = request.body.messageText;
        await db.updateMessageByID(messageID, title, message);
        return response.redirect("/");
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

module.exports = {
    isRouteAuthenticated,
    showAddMessagePage,
    addNewMessage,
    deleteMessage,
    showUpdateMessagePage,
    updateMessage,
}