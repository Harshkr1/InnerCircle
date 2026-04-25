const { Client } = require("pg");
require("dotenv").config();

async function createTables() {
    const args = process.argv.slice(2);

    const useLocalDB = args.includes("LOCAL_DATABASE");

    const connectionString = useLocalDB
        ? process.env.DEVELOPMENT_DATABASE_URL
        : process.env.PRODUCTION_DATABASE_URL;

    const client = new Client({ connectionString });

    await client.connect();
    console.log("Connected to:", useLocalDB ? "LOCAL DB" : "PRODUCTION DB");

    try {
        await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50),
        username VARCHAR(50) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        membership_status VARCHAR(20) DEFAULT 'member',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
        title TEXT,
        message_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        console.log(" Tables created successfully");


        const userResult = await client.query(`
            INSERT INTO users (first_name, last_name, username, password)
            VALUES ('Harsh', 'Kumar', 'harsh@test.com', 'dummyhashedpassword')
            ON CONFLICT (username) DO NOTHING
            RETURNING id;
            `);

        let userId;

        if (userResult.rows.length > 0) {
            userId = userResult.rows[0].id;
        } else {
            const existingUser = await client.query(
                "SELECT id FROM users WHERE username = $1",
                ["harsh@test.com"]
            );
            userId = existingUser.rows[0].id;
        }

        await client.query(`
            INSERT INTO messages (user_id, title, message_text)
            VALUES ($1, 'Welcome to InnerCircle', 'This is your first post 🚀')
            ON CONFLICT DO NOTHING;
            `, [userId]);

        console.log("✅ Sample data inserted");
    } catch (error) {
        console.error(" Error creating tables:", error);
    } finally {
        await client.end();
        console.log("🔌 DB connection closed");
    }
}

createTables();