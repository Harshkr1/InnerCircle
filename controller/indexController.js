const db = require("../db/query");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

async function showSignUpForm(request, response) {
    response.render("sign-up");
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
        await db.addUser(firstName, lastName, username, password);
        response.render("log-in");
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    showSignUpForm,
    createNewUser,
}