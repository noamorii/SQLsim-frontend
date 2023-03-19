import React, {useContext, useState} from 'react';
import DbFileUpload from "./DbFileUpload";
import ResultTable from "./ResultTable";
import {DbContext, SqlContext} from "./context/context";
import Visualisation from "./UI/Data/Visualisation";


const SqlReply = () => {
    const [error, setError] = useState(null);
    const [results, setResults] = useState([]);

    const {db} = useContext(DbContext);
    const {sql} = useContext(SqlContext);

    function exec(sql) {
        try {
            setResults(db.exec(sql));
            setError(null);
        } catch (err) {
            setError(err);
            setResults([]);
        }
    }

    return (
        <div className="App">
            <h1 style={{textAlign:"center"}}>SQL simulator</h1>
            <textarea
                onChange={(e) => exec(e.target.value)}
                placeholder="Enter some SQL."/>

            <pre className="error">{(error || "").toString()}</pre>

            <DbFileUpload sql={sql}/>

            <pre>
                {results.map( ({columns, values}, i) =>
                    <ResultTable key={i} columns={columns} values={values}/>
                )}
            </pre>

            <Visualisation/>
        </div>
    );
};

export default SqlReply;
