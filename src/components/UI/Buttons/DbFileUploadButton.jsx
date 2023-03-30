import React, { useContext, useState } from 'react';
import { DbContext, SqlContext } from '../../context/context';

const DbFileUploadButton = () => {
    const { setDb } = useContext(DbContext);
    const { sql } = useContext(SqlContext);
    const [fileName, setFileName] = useState('Select File');

    function handleFile(e) {
        const inputFile = e.target.files[0];
        if (inputFile) {
            setFileName(inputFile.name);
            const reader = new FileReader();
            reader.onload = function () {
                const buffer = this.result;
                const array = new Uint8Array(buffer);
                setDb(new sql.Database(array));
            };
            reader.readAsArrayBuffer(inputFile);
        }
    }

    return (
        <label htmlFor="dbfile" className="file-upload-btn">
            <span>{fileName}</span>
            <input type="file" id="dbfile" onChange={handleFile} />
        </label>
    );
};

export default DbFileUploadButton;
