import React, {useContext} from 'react';
import {DbContext} from "../../context/context";
import Button from "./Button";
import {HiDownload} from "react-icons/hi";

/**
 * DbFileDownloadButton component creates a button to download the database file.
 *
 * @component
 * @returns {JSX.Element} The rendered DbFileDownloadButton component.
 */
const DbFileDownloadButton = () => {
    const {db} = useContext(DbContext);

    /**
     * Handles the download process of the database file.
     *
     * @function
     * @param {Object} e - The event object.
     */
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
        <Button onClick={event => downloadFile(event)} text="Download" icon={<HiDownload/>}/>
    );
};

export default DbFileDownloadButton;
