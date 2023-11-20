module.exports = {
    getCustomerFromDatabase,
    createCustomerInDatabase,
};
const db = require("../db_ops/db");

async function getCustomerFromDatabase(sessionId) {
    return await db.query(`
        SELECT sessions.id,
               customers.email,
               customers.name,
               customers.address,
               customers.city,
               customers.province,
               customers.postcode,
               customers.country
        FROM sessions
                 JOIN customers ON sessions.customer_id = customers.id
        WHERE sessions.id = ?
    `, [sessionId]);
}

async function createCustomerInDatabase(sessionId, postcode = "") {
    const conn = await db.getConnection();

    try {
        await conn.query("START TRANSACTION");

        // Save the result of the INSERT operation.
        const insertResult = await conn.query(`
            INSERT INTO customers (postcode)
            VALUES (?)
        `, [postcode ? postcode.match(/[A-Z0-9]{6}/) : ""]);

        // Retrieve the ID of the last inserted item.
        const [lastIdResult] = await conn.query(`
            SELECT LAST_INSERT_ID() AS customerId;
        `);

        // Extract the customerId from lastIdResult
        const { customerId } = lastIdResult[0];

        await conn.query(`
            INSERT INTO sessions (id, customer_id)
            VALUES (?, ?)
        `, [sessionId, customerId]);

        await conn.query("COMMIT");

        return await conn.query(`
            SELECT * FROM customers WHERE id = ?
        `, [customerId]);

    } catch (error) {
        await conn.query("ROLLBACK");
        throw error;
    } finally {
        conn.release();
    }
}
