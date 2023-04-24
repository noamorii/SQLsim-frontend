import {createContext} from "react";

/**
 * A React context that provides access to the SQLite database instance.
 * @constant
 * @type {React.Context}
 */
export const DbContext = createContext(null);
/**
 * A React context that provides access to the SQL.js library instance.
 * @constant
 * @type {React.Context}
 */
export const SqlContext = createContext(null);
/**
 * A React context that provides access to database error information.
 * @constant
 * @type {React.Context}
 */
export const DbErrorContext = createContext(null);
