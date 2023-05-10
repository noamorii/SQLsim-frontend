import {createContext} from "react";

/**
 * A React context that provides access to the SQLite database instance.
 * @constant
 */
export const DbContext = createContext(null);
/**
 * A React context that provides access to the SQL.js library instance.
 * @constant
 */
export const SqlContext = createContext(null);
