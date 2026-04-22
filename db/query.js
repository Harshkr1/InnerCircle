const pool = require("./Pool");

async function doesUsernameExist(username) {
    const { rows } = await pool.query("SELECT * FROM users WHERE username= $1 LIMIT 1", [username]);
    return rows.length > 0;
}

async function addUser(firstName, lastName, username, password) {
    try {
        await pool.query("INSERT INTO users(first_name, last_name, username, password) VALUES ($1,$2,$3,$4)", [firstName, lastName, username, password]);
        return true;
    } catch (error) {
        console.error('Database insertion error:', error);
        throw error;
    }
}

async function findUserByUsername(username) {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE username= $1 ", [username]);
        return rows;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

async function findUserByID(id) {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE id= $1 ", [id]);
        return rows;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

module.exports = {
    doesUsernameExist,
    addUser,
    findUserByUsername,
    findUserByID,
}