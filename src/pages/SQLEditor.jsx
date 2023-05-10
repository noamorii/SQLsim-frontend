import React, {useContext} from "react";
import "../styles.css";
import SQLReply from "../components/form/selectQuery/editor/SqlReply";
import Loader from "../components/UI/Loader/Loader";
import {DbContext} from "../context/context";

export default function SQLEditor() {
    const {db} = useContext(DbContext);

    if (!db) return <Loader/>;
    return <SQLReply/>;
}
