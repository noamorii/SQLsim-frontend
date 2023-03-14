import React, {useState} from 'react';
import DbFileUpload from "./DbFileUpload";
import ResultTable from "./ResultTable";

const SqlReply = ({db, sql}) => {

    const [error, setError] = useState(null);
    const [results, setResults] = useState([]);
    const [db2, setDb] = useState(db);

    function exec(sql) {
        try {
            setResults(db2.exec(sql));
            setError(null);
        } catch (err) {
            setError(err);
            setResults([]);
        }
    }

    function createDb(newDb) {
        setDb(newDb);
    }

    return (
        <div className="App">
            <h1 style={{textAlign:"center"}}>SQL simulator</h1>
            <textarea
                onChange={(e) => exec(e.target.value)}
                placeholder="Enter some SQL."/>
            <pre
                className="error">{(error || "").toString()}
            </pre>

            <DbFileUpload sql={sql} createDb={createDb}/>

            <pre>
                {results.map(({columns, values}, i) => (<ResultTable key={i} columns={columns} values={values}/>))}
            </pre>
        </div>
    );
};

export default SqlReply;
