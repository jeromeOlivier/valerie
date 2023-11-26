/**
 * user_services module
 * @module services/user_services
 */

module.exports = {
    findCustomer,
    createCustomer,
    updateCustomer,
};
const db = require("../db_ops/db");
const { Customer } = require("../data_models/customer");

/**
 * Creates a new customer in the database and associates it with the provided session ID.
 *
 * @param {string} sessionId - The session ID to associate the customer with.
 * @param {string} [postcode=""] - The postcode of the customer. Optional, default is an empty string.
 * @returns {Promise<Customer>} A Promise that resolves to the created customer record.
 * @throws {Error} If an error occurs during the database operations.
 */
async function createCustomer(sessionId, postcode = "") {
    const conn = await db.getConnection();

    try {
        await conn.query("START TRANSACTION");

        // Save the result of the INSERT operation.
        await conn.query(`
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

        const data = query[0][0];
        return new Customer(data.given_name, data.family_name, data.email, data.address, data.city, data.province, data.postcode, data.country);

    } catch (error) {
        await conn.query("ROLLBACK");
        throw error;
    } finally {
        conn.release();
    }
}

/**
 * Finds a customer based on the given session ID.
 *
 * @param {number} sessionId - The ID of the session to search for.
 * @return {Promise<Customer>} - A Promise that resolves to an object representing the found customer, or undefined if no
 * customer was found.
 */
async function findCustomer(sessionId) {
    const query = await db.query(`
        SELECT sessions.id,
               customers.given_name,
               customers.family_name,
               customers.email,
               customers.address,
               customers.city,
               customers.province,
               customers.postcode,
               customers.country
        FROM sessions
                 JOIN customers ON sessions.customer_id = customers.id
        WHERE sessions.id = ?
    `, [sessionId]);
    return query[0][0];
    // return a customer object instead of an anonymous object
}


async function updateCustomer(customer) {
    // save customer to the database
}
