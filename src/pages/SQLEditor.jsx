import React, {useState, useEffect} from "react";
import "../styles.css";
import initSqlJs from "sql.js";
import sqlWasm from "!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm";
import SQLReply from "../components/SQLReply";
import Loader from "../components/UI/Loader/Loader";

export default function SQLEditor() {
    const [db, setDb] = useState(null);
    const [error, setError] = useState(null);
    const [sql, setSql] = useState(null);

    useEffect(async () => {
        try {
            const SQL = await initSqlJs({locateFile: () => sqlWasm});
            setSql(SQL);
            setDb(new SQL.Database());
        } catch (err) {
            setError(err);
        }
    }, []);

    if (error)
        return <pre>{error.toString()}</pre>;
    else if (!db)
        return (<div style={{display: "flex", justifyContent: "center", marginTop: 250}}><Loader/></div>);
    else
        return <SQLReply db={db} sql={sql}/>;
}
