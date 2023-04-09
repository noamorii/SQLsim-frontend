import React, {useContext, useState} from 'react';
import ResultTable from "./ResultTable";
import {DbContext} from "./context/context";
import Visualisation from "./visualisation/Visualisation";


const SqlReply = () => {
    const [error, setError] = useState(null);
    const [results, setResults] = useState([]);
    const {db} = useContext(DbContext);

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
            <h1 style={{textAlign: "center"}}>SQL simulator</h1>
            <textarea
                onChange={(e) => exec(e.target.value)}
                placeholder="Enter some SQL."/>

            <pre className="error">{(error || "").toString()}</pre>

            <pre>
                {results.map(({columns, values}, i) =>
                    <ResultTable key={i} columns={columns} values={values}/>
                )}
            </pre>

            <Visualisation values={results}/>
        </div>
    );
};

export default SqlReply;
