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

async function addMessage(userId, title, messageText, username) {
    try {
        await pool.query("INSERT INTO message(user_id, title, message_text,username ) VALUES ($1,$2,$3,$4)", [userId, title, messageText, username]);
        return true;
    } catch (error) {
        console.log('Message Insertion Error ', error);
        throw new Error(error);
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

async function findUserIdByUsername(username) {
    try {
        const { rows } = await pool.query("SELECT id FROM users WHERE username= $1 ", [username]);
        return rows[0]?.id;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

async function findAllMessages() {
    try {
        const { rows } = await pool.query("SELECT * FROM message ");
        console.log(rows);
        return rows;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

async function updateMembershipStatus(id) {
    try {
        await pool.query("UPDATE users SET membership_status = 'elite' WHERE id= $1 ", [id]);
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

async function getMemberShipStatus(id) {
    try {
        const { rows } = await pool.query("SELECT membership_status FROM users WHERE id= $1 ", [id]);
        return rows[0]?.membership_status;
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
    addMessage,
    findUserIdByUsername,
    findAllMessages,
    updateMembershipStatus,
    getMemberShipStatus,
}