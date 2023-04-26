import React, {useContext} from "react";
import "../styles.css";
import SQLReply from "../components/SQLReply";
import Loader from "../components/UI/Loader/Loader";
import {DbContext, DbErrorContext} from "../components/context/context";

export default function SQLEditor() {
    const {db} = useContext(DbContext);
    const {error} = useContext(DbErrorContext);

    if (error)
        return <pre>{error.toString()}</pre>;
    else if (!db)
        return <Loader/>;
    else
        return <SQLReply/>;
}
