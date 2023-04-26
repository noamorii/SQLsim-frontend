import React, { useContext, useState } from 'react';
import { DbContext, SqlContext } from '../../context/context';

/**
 * DbFileUploadButton is a React component that renders an input element for uploading a SQLite database file.
 * It sets the database in the DbContext when a new file is uploaded.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.handleFileUpload - A callback function to be called when a file is successfully uploaded.
 * @returns {React.Element} The DbFileUploadButton component.
 */
const DbFileUploadButton = (props) => {
    const { setDb } = useContext(DbContext);
    const { sql } = useContext(SqlContext);
    const [fileName, setFileName] = useState('Select File');

    /**
     * handleFile is a function that handles the file input change event.
     * It reads the selected file as an ArrayBuffer, creates a new SQLite database instance from it,
     * updates the database in the DbContext, and calls the handleFileUpload callback.
     *
     * @param {Object} e - The event object representing the file input change event.
     */
    function handleFile(e) {
        const inputFile = e.target.files[0];
        if (inputFile) {
            setFileName(inputFile.name);
            const reader = new FileReader();
            reader.onload = function () {
                const buffer = this.result;
                const array = new Uint8Array(buffer);
                setDb(new sql.Database(array));
                props.handleFileUpload();
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
