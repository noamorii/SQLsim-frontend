import React, {useContext, useState} from 'react';
import {DbContext, SqlContext} from "./context/context";

const DbFileUpload = () => {

    const {db, setDb} = useContext(DbContext);
    const {sql} = useContext(SqlContext);
    const [setDataArray] = useState(null);

    function handleFile(e) {
        const inputFile = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function () {
            const buffer = this.result;
            const array = new Uint8Array(buffer);
            setDataArray(array);
            const db = new sql.Database(array);
            setDb(db);
        };
        reader.readAsArrayBuffer(inputFile);
    }

    function downloadFile(e) {
        e.preventDefault();
        const blob = new Blob([db.export()]);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = window.URL.createObjectURL(blob);
        a.download = "sql.db";
        a.onclick = function () {
            setTimeout(function () {
                window.URL.revokeObjectURL(a.href);
            }, 1500);
        };
        a.click();
    }

    return (
        <div>
            <label className="button">Load an SQLite database file: </label>
            <input type='file' id='dbfile' onChange={event => handleFile(event)}/>
            <button onClick={event => downloadFile(event)}>Download</button>
        </div>
    );
};

export default DbFileUpload;
