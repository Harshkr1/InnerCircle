const { Pool } = require("pg");
require("dotenv").config();

module.exports = new Pool({
  connectionString: process.env.DEVELOPMENT_DATABASE_URL,
});
