const db = require("../db/query");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const passport = require("passport");
const { getAuthenticationStatusAndFullNameById, loadIndexPage } = require(".//indexController.js");

async function isAuthenticated(request, response, next) {
    const { isAuthenticated, fullName } = await getAuthenticationStatusAndFullNameById(request, response);

    if (!request.isAuthenticated()) {
        return response.render("log-in", { errors: ["Please login first"], isAuthenticated: isAuthenticated, fullName: fullName });
    }
    next();
}

async function showAddMessagePage(request, response, next) {
    const { isAuthenticated, fullName } = await getAuthenticationStatusAndFullNameById(request, response);

    if (!request.isAuthenticated()) {
        return response.render("log-in", { errors: ["Please login first"], isAuthenticated: isAuthenticated, fullName: fullName });
    }
    return response.render("add-message", { isAuthenticated: isAuthenticated, fullName: fullName });
}

async function addNewMessage(request, response, next) {
    const { isAuthenticated, fullName } = await getAuthenticationStatusAndFullNameById(request, response);

    if (!request.isAuthenticated()) {
        return response.render("log-in", { errors: ["Please login first"], isAuthenticated: isAuthenticated, fullName: fullName });
    }
    try {
        const title = request.body.title;
        const message = request.body.messageText;
        const username = response.locals.currentUser.username;
        const userId = await db.findUserIdByUsername(username);
        await db.addMessage(userId, title, message, username);
        return loadIndexPage(request, response);
    } catch (error) {
        throw new Error(error);
    }
}


async function deleteMessage(request, response) {
    try {
        const messageID = request.query.messageId;
        await db.deleteMessageByID(messageID);
        return loadIndexPage(request, response);
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

async function showUpdateMessagePage(request, response) {
    const { isAuthenticated, fullName } = await getAuthenticationStatusAndFullNameById(request, response);

    try {
        if (!request.isAuthenticated()) {
            return response.render("log-in", { errors: ["Please login first"], fullName: null, isAuthenticated: isAuthenticated });
        }
        const messageID = request.query.messageId;
        const message = await db.getMessageByID(messageID);
        return response.render("update-message", { messageID: messageID, fullName: fullName, isAuthenticated: isAuthenticated, message: message });
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

async function updateMessage(request, response) {
    const { isAuthenticated, fullName } = await getAuthenticationStatusAndFullNameById(request, response);

    try {
        if (!request.isAuthenticated()) {
            return response.render("log-in", { errors: ["Please login first"], isAuthenticated: isAuthenticated, fullName: fullName });
        }
        const messageID = request.query.currentMessageId;
        const title = request.body.title;
        const message = request.body.messageText;
        await db.updateMessageByID(messageID, title, message);
        return loadIndexPage(request, response);
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

module.exports = {
    showAddMessagePage,
    addNewMessage,
    deleteMessage,
    showUpdateMessagePage,
    updateMessage,
}