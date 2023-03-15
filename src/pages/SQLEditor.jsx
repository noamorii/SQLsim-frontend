import React, {useContext} from "react";
import "../styles.css";
import SQLReply from "../components/SQLReply";
import Loader from "../components/UI/Loader/Loader";
import {DbContext, DbErrorContext, SqlContext} from "../components/context/context";


export default function SQLEditor() {
    const {db} = useContext(DbContext);
    const {sql} = useContext(SqlContext);
    const {error} = useContext(DbErrorContext);

    if (error)
        return <pre>{error.toString()}</pre>;
    else if (!db)
        return (<div style={{display: "flex", justifyContent: "center", marginTop: 250}}><Loader/></div>);
    else
        return <SQLReply sql={sql}/>;
}
