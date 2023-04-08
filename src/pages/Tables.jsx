import React, {useContext, useState} from 'react';
import DatabaseDiagram from "../components/nodes/DatabaseDiagram";
import {DbContext} from "../components/context/context";
import PopupUpload from "../components/UI/PopupUpload";

const Tables = () => {

    const [error, setError] = useState(null);
    const {db} = useContext(DbContext);

    function exec(sql) {
        try {
            db.exec(sql);
            setError(null);
        } catch (err) {
            setError(err);
        }
    }

    return (
        <div>
            <h1>Tables</h1>
            <div style={{display: "flex", alignContent:"flex-end"}}>
                <div style={{ width: '100%', height: '500px' }}>
                    <DatabaseDiagram/>
                </div>
                <textarea style={{width: '500px', height: '500px'}}
                          onChange={(e) => exec(e.target.value)}
                          placeholder="Enter some SQL."/>

                <pre className="error">{(error || "").toString()}</pre>
            </div>
            <PopupUpload/>
        </div>

    );
};

export default Tables;
