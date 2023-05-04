import React, {useContext} from "react";
import "../styles.css";
import SQLReply from "../components/SQLReply";
import Loader from "../components/UI/Loader/Loader";
import {DbContext} from "../components/context/context";

export default function SQLEditor() {
    const {db} = useContext(DbContext);

    if (!db) return <Loader/>;
    return <SQLReply/>;
}
