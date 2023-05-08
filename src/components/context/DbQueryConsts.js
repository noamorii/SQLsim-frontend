/**
 * Query to get the metadata for all tables in the database, including table name,
 * number of attributes, column names, and data types.
 * @constant
 * @type {string}
 */
export const GET_ALL_TABLES_DATA_QRY = "SELECT m.name AS table_name, COUNT(p.name) AS attribute_count, GROUP_CONCAT(p.name, ',') AS column_names, GROUP_CONCAT(p.type, ',') AS data_types FROM pragma_table_info(m.name) p JOIN (SELECT name FROM sqlite_master WHERE type='table') m WHERE m.name NOT IN ('sqlite_sequence', 'schema_migrations', 'ar_internal_metadata') GROUP BY table_name ORDER BY table_name;"

/**
 * Query to get the names of all tables in the database.
 * @constant
 * @type {string}
 */
export const ALL_TABLES_QRY = "SELECT name FROM sqlite_master WHERE type='table'";

/**
 * Query to get the names of all user-created tables in the database, excluding SQLite system tables.
 * @constant
 * @type {string}
 */
export const SELECT_TABLES_QRY = "SELECT name AS table_name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%';";

/**
 * Query to get foreign key relationships between tables in the database, including the source table,
 * source attribute, destination table, and destination attribute.
 * @constant
 * @type {string}
 */
export const SELECT_FRN_KEYS_QRY = "SELECT m.name AS table_from, f1.'from' AS attribute, f1.'table' AS table_to, f1.'to' AS attribute FROM sqlite_master AS m JOIN pragma_foreign_key_list(m.name) AS f1 WHERE m.type = 'table';";

/**
 * Array containing the types of SQL joins represented in the app.
 * @constant
 * @type {string[]}
 */
export const JOIN_TYPES = ["NATURAL JOIN", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"];

/**
 * A constant array containing the aggregate functions used in SQL queries.
 * @type {string[]}
 */
export const AGGREGATE_FUNCTIONS = ["SUM()", "COUNT()", "AVG()", "MIN()", "MAX()"];
/**
 * A constant array containing the basic operations used in SQL queries.
 * @type {string[]}
 */
export const BASIC_OPERATIONS = ["WHERE", "ORDER BY", "GROUP BY", "HAVING"];

/**
 * A constant array containing the conditions used in SQL queries.
 * @type {string[]}
 */
export const CONDITIONS = ["AND", "OR", "LIKE"];

/**
 * A constant array containing the output modifications used in SQL queries.
 * @type {string[]}
 */
export const OUTPUT_MODIFICATIONS = ["DISTINCT", "ASC", "DESC"];

