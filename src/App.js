import { HashRouter } from "react-router-dom";
import Navbar from "./components/UI/Navbar/Navbar";
import AppRouter from "./AppRouter";
import { DbContext, SqlContext } from "./context/context";
import { useEffect, useState } from "react";
import initSqlJs from "sql.js";
import sqlWasm from "!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm";

/**
 * App is the root component of the application.
 * It sets up the database and SQL context using SQL.js library,
 * and provides the context values to the child components.
 *
 * @returns {JSX.Element} - The rendered App component.
 */
export default function App() {
  const [db, setDb] = useState(null);
  const [sql, setSql] = useState(null);

  /**
   * Initializes the SQL.js library and sets up the database.
   * This effect runs only once during the component's initialization.
   * It is an asynchronous effect that ensures the SQL.js library is loaded and the database is ready.
   *
   * @effect
   * @async
   * @returns {Promise<void>} A promise that resolves when the SQL.js library is initialized and the database is set up.
   * The promise resolves without a value.
   */
  useEffect(async () => {
    try {
      const SQL = await initSqlJs({ locateFile: () => sqlWasm });
      setSql(SQL);
      setDb(new SQL.Database());
    } catch (ignore) {}
  }, []);

  return (
      <SqlContext.Provider value={{sql, setSql}}>
        <DbContext.Provider value={{db, setDb}}>
          <HashRouter>
            <Navbar />
            <AppRouter />
          </HashRouter>
        </DbContext.Provider>
      </SqlContext.Provider>
  )
}
