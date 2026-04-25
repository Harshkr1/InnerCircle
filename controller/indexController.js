const db = require("../db/query");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const passport = require("passport");

async function showSignUpForm(request, response) {
    const { isAuthenticated, fullName } = getAuthenticationStatusAndFullNameById(request, response);

    response.render("sign-up", { isAuthenticated: isAuthenticated, fullName: fullName, errors: null });
}

async function getAuthenticationStatusAndFullNameById(request, response) {
    const isAuthenticated = request.isAuthenticated();
    let fullName = null;
    let userId = null;
    if (isAuthenticated) {
        userId = await db.findUserIdByUsername(response.locals.currentUser.username);
        fullName = await db.getFullNameByID(userId);
    }
    return { isAuthenticated, fullName };
}

async function loadIndexPage(request, response) {
    try {
        let userId = null;
        const { isAuthenticated, fullName } = await getAuthenticationStatusAndFullNameById(request, response);
        let memberShipStatus = null;
        if (isAuthenticated) {

            userId = await db.findUserIdByUsername(response.locals.currentUser.username);
            memberShipStatus = await db.getMemberShipStatus(userId);
            console.log(memberShipStatus);
            console.log("USER ID IS " + userId);
        }
        const messages = await db.findAllMessages();
        return response.render("index", { messages: messages, isAuthenticated: isAuthenticated, memberShipStatus: memberShipStatus, userId: userId, fullName: fullName });
    } catch (error) {
        throw new Error(error);
    }
};

async function showIndexPage(request, response) {
    await loadIndexPage(request, response);
}

async function createNewUser(request, response) {

    console.log(request.body);
    const { isAuthenticated, fullName } = getAuthenticationStatusAndFullNameById(request, response);

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.render("sign-up", { errors: errors.array(), isAuthenticated: isAuthenticated, fullName: fullName });
    }
    const firstName = request.body.firstName;
    const lastName = request.body.lastName;
    const username = request.body.username;
    const password = request.body.password;
    console.log({
        firstName,
        lastName,
        username,
        password
    });
    try {
        const hashedPassword = await bcrypt.hash(password, 10 /* saltLength */)
        await db.addUser(firstName, lastName, username, hashedPassword);
        const { isAuthenticated, fullName } = await getAuthenticationStatusAndFullNameById(request, response);
        response.render("log-in", { errors: [], isAuthenticated: isAuthenticated, fullName: null });
    } catch (error) {
        throw new Error(error);
    }
}

async function showLoginPage(request, response) {
    // if already authenticated then not need to Authenticate again
    if (request.isAuthenticated()) {
        loadIndexPage(request, response);
    }
    const { isAuthenticated, fullName } = await getAuthenticationStatusAndFullNameById(request, response);
    response.render("log-in", { errors: [], isAuthenticated: isAuthenticated, fullName: fullName });
}

async function logIn(request, response, next) {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/log-in"
    })(request, response, next);
}

function logOut(request, response, next) {
    request.logout((err) => {
        if (err) {
            return next(err);
        }
        response.redirect("/");
    });
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

async function showUpdateMemberShipForm(request, response, next) {
    const { isAuthenticated, fullName } = await getAuthenticationStatusAndFullNameById(request, response);

    if (!request.isAuthenticated()) {
        return response.render("log-in", { errors: ["Please login first"], isAuthenticated: isAuthenticated, fullName: fullName });
    }

    response.render("update-membership", { isAuthenticated: isAuthenticated, fullName: fullName });
}

async function updateMembershipStatus(request, response) {
    const { isAuthenticated, fullName } = await getAuthenticationStatusAndFullNameById(request, response);

    try {
        if (request.body.answer == "echo") {
            const userId = await db.findUserIdByUsername(response.locals.currentUser.username);
            await db.updateMembershipStatus(userId);
            return loadIndexPage(request, response);
        } else {
            return response.render("update-membership", { isAuthenticated: isAuthenticated, fullName: fullName });
        }
    } catch (error) {
        console.log(error);
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
    showSignUpForm,
    createNewUser,
    showLoginPage,
    logIn,
    showIndexPage,
    logOut,
    showAddMessagePage,
    addNewMessage,
    showUpdateMemberShipForm,
    updateMembershipStatus,
    deleteMessage,
    showUpdateMessagePage,
    updateMessage,
}