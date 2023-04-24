import React from "react";

/**
 * Executes the given SQL queries on the database and returns the values from the result.
 * If an error occurs during the execution, it returns an empty array.
 *
 * @param {sql.Database} db - The SQLite database instance to execute the query on.
 * @param {string} sql - The SQL query to execute.
 * @returns {Array} - The values from the executed query or an empty array in case of an error.
 */
export const executeQueryValues = (db, sql) => {
    try {
        return db.exec(sql)[0].values;
    } catch (err) {
        return [];
    }
}

/**
 * Executes the given SQL queries on the database and returns the result as an object with 'columns' and 'values' properties.
 * If an error occurs during the execution, it returns an object with empty arrays for 'columns' and 'values'.
 *
 * @param {sql.Database} db - The SQLite database instance to execute the query on.
 * @param {string} sql - The SQL query to execute.
 * @returns {Object} - The result of the executed query with 'columns' and 'values' properties or an object with empty arrays in case of an error.
 */
export const executeQuery = (db, sql) => {
    try {
        return db.exec(sql)[0];
    } catch (err) {
        return {columns: [], values: []};
    }
}

