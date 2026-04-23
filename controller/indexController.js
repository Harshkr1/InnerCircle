const db = require("../db/query");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const passport = require("passport");

async function showSignUpForm(request, response) {
    response.render("sign-up");
}

async function loadIndexPage(request, response) {
    try {
        let userId = null;;
        const isAuthenticated = request.isAuthenticated();
        let memberShipStatus = null;
        if (isAuthenticated) {
            userId = await db.findUserIdByUsername(response.locals.currentUser.username);
            memberShipStatus = await db.getMemberShipStatus(userId);
        }
        const messages = await db.findAllMessages();
        return response.render("index", { messages: messages, isAuthenticated: isAuthenticated, memberShipStatus: memberShipStatus });
    } catch (error) {
        throw new Error(error);
    }
};

async function showIndexPage(request, response) {
    await loadIndexPage(request, response);
}

async function createNewUser(request, response) {

    console.log(request.body);
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
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
        response.render("log-in");
    } catch (error) {
        throw new Error(error);
    }
}

function showLoginPage(request, reponse) {
    // if already authenticated then not need to Authenticate again
    if (request.isAuthenticated()) {
        loadIndexPage(request, response);
    }
    reponse.render("log-in")
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

function showAddMessagePage(request, response, next) {
    if (!request.isAuthenticated()) {
        return response.render("log-in", { error: "Please login first" });
    }
    return response.render("add-message");
}

async function addNewMessage(request, response, next) {
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
    response.render("update-membership");
}

async function updateMembershipStatus(request, response) {
    try {
        if (request.body.answer == "echo") {
            const userId = await db.findUserIdByUsername(response.locals.currentUser.username);
            await db.updateMembershipStatus(userId);
            return loadIndexPage(request, response);
        } else {
            return response.render("update-membership");
        }
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
}