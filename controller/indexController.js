const db = require("../db/query");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const passport = require("passport");

async function showSignUpForm(request, response) {
    response.render("sign-up");
}

async function showIndexPage(request, response) {
    response.render("index", { user: response.locals.currentUser });
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
module.exports = {
    showSignUpForm,
    createNewUser,
    showLoginPage,
    logIn,
    showIndexPage,
    logOut,
}