/**
 * user_services module
 * @module services/user_services
 */

module.exports = {
    findCustomer,
    createCustomer,
    updateCustomer,
    makeCustomerObject,
};
const db = require("../db_ops/db");
const { Customer, ShippingAddress } = require("../data_models/");
const { query } = require("express");

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
            INSERT INTO shipping_addresses (postcode)
            VALUES (?)
        `, [postcode ? postcode.match(/[A-Z0-9]{6}/) : ""]);

        // Retrieve the ID of the last inserted item.
        const [lastIdResult] = await conn.query(`
            SELECT LAST_INSERT_ID() AS customerId;
        `);

        // Extract the addressId from lastIdResult
        const { addressId } = lastIdResult[0];

        // INSERT customer with given shipping_address_id
        await conn.query(`
            INSERT INTO customers (shipping_address_id)
            VALUES (?)
        `, [addressId]);

        // Retrieve the ID of the customer inserted above
        const [customerIdResult] = await conn.query(`
            SELECT LAST_INSERT_ID() AS customerId;
        `);

        // Extract the customerId from lastIdResult
        const { customerId } = customerIdResult[0];

        await conn.query(`
            INSERT INTO sessions (id, customer_id)
            VALUES (?, ?)
        `, [sessionId, customerId]);

        await conn.query("COMMIT");

        const query = await conn.query(`
            SELECT * FROM customers WHERE id = ?
        `, [customerId]);

        const data = query[0][0];
        const shippingAddress = new ShippingAddress(
            data.address_01,
            data.address_02,
            data.city,
            data.province,
            data.postcode,
            data.country,
        );
        return new Customer(
            data.given_name,
            data.family_name,
            data.email,
            shippingAddress,
        );

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
 * @param {string} sessionId - The ID of the session to search for.
 * @return {Promise<Customer>} - A Promise that resolves to an object representing the found customer, or undefined if
 *     no customer was found.
 */
async function findCustomer(sessionId) {
    const query = await db.query(`
        SELECT IFNULL(c.given_name, '')  AS 'given_name',
               IFNULL(c.family_name, '') AS 'family_name',
               IFNULL(c.email, '')       AS 'email',
               IFNULL(sa.address_01, '') AS 'address_01',
               IFNULL(sa.address_02, '') AS 'address_02',
               IFNULL(sa.city, '')       AS 'city',
               IFNULL(sa.province, '')   AS 'province',
               IFNULL(sa.postcode, '')   AS 'postcode',
               IFNULL(sa.country, '')    AS 'country'
        FROM sessions ses
                 JOIN customers c ON ses.customer_id = c.id
                 JOIN shipping_addresses sa ON c.shipping_address_id = sa.id
        WHERE ses.id = ?
    `, [sessionId]);
    return makeCustomerObject(query[0][0]);
}

async function updateCustomer(customer) {
    // save customer to the database
}

function makeCustomerObject(data) {
    const address = new ShippingAddress(
        data.address_01 || '',
        data.address_02 || '',
        data.city || '',
        data.province || '',
        data.postcode || '',
        data.country || 'Canada',
    );
    return new Customer(
        data.given_name || '',
        data.family_name || '',
        data.email || '',
        address,
    );
}
