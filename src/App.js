import {BrowserRouter} from "react-router-dom";
import Navbar from "./components/UI/Navbar/Navbar";
import AppRouter from "./components/AppRouter";
import {DbContext, DbErrorContext, SqlContext} from "./components/context/context";
import {useEffect, useState} from "react";
import initSqlJs from "sql.js";
import sqlWasm from "!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm";

export default function App() {

    const [db, setDb] = useState(null)
    const [sql, setSql] = useState(null)
    const [error, setError] = useState(null)

    useEffect(async () => {
        try {
            const SQL = await initSqlJs({locateFile: () => sqlWasm});
            setSql(SQL);
            setDb(new SQL.Database());
        } catch (err) {
            setError(err);
        }
    }, []);

    return (
        <DbErrorContext.Provider value={{
            error,
            setError
        }}>
            <SqlContext.Provider value={{
                sql,
                setSql
            }}>
                <DbContext.Provider value={{
                    db,
                    setDb
                }}>
                    <BrowserRouter>
                        <Navbar/>
                        <AppRouter/>
                    </BrowserRouter>
                </DbContext.Provider>
            </SqlContext.Provider>
        </DbErrorContext.Provider>
    );
}
