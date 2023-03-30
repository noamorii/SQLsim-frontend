import React, {useContext} from 'react';
import {DbContext} from "../../context/context";

const DbFileDownloadButton = () => {
    const {db} = useContext(DbContext);

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
            <button onClick={event => downloadFile(event)}>Download</button>
        </div>
    );
};

export default DbFileDownloadButton;
