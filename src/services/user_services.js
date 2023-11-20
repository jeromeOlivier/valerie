module.exports = {
    getCustomerFromDatabase,
    createCustomerInDatabase,
};
const db = require("../db_ops/db");
const { Customer } = require("../data_models/customer");

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

/**
 * Creates a new customer in the database and associates it with the provided session ID.
 *
 * @param {string} sessionId - The session ID to associate the customer with.
 * @param {string} [postcode=""] - The postcode of the customer. Optional, default is an empty string.
 * @returns {Promise<Customer>} A Promise that resolves to the created customer record.
 * @throws {Error} If an error occurs during the database operations.
 */
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

        const query = await conn.query(`
            SELECT * FROM customers WHERE id = ?
        `, [customerId]);
        const data = query[0];
        return new Customer(data.email, data.name, data.address, data.city, data.province, data.postcode, data.country);

    } catch (error) {
        await conn.query("ROLLBACK");
        throw error;
    } finally {
        conn.release();
    }
}
