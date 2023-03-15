import React, {useContext} from 'react';
import {DbContext, SqlContext} from "./context/context";

const DbFileUpload = () => {

    const {setDb} = useContext(DbContext);
    const {sql} = useContext(SqlContext);

    function handleFile(e) {
        const inputFile = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function () {
            const buffer = this.result;
            const array = new Uint8Array(buffer);
            const db = new sql.Database(array);
            setDb(db);
        };
        reader.readAsArrayBuffer(inputFile);
    }

    return (
        <div>
            <label className="button">Load an SQLite database file: </label>
            <input type='file' id='dbfile' onChange={(event => handleFile(event))}/>
            <button>Upload</button>
        </div>
    );
};

export default DbFileUpload;
