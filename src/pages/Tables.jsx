import React, {useContext, useState} from 'react';
import DatabaseDiagram from "../components/DatabaseDiagram";
import {DbContext} from "../components/context/context";
import PopupUpload from "../components/UI/PopupUpload";

const Tables = () => {

    const [error, setError] = useState(null);
    const [edges, setEdges] = useState([]);
    const [nodes, setNodes] = useState([]);

    const {db} = useContext(DbContext);

    const SELECT_TABLES_QRY = `SELECT name AS table_name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%';`;
    const SELECT_FRN_KEYS_QRY = `SELECT m1.tbl_name AS from_table, m2.tbl_name AS to_table FROM sqlite_master m1 JOIN pragma_foreign_key_list(m1.tbl_name) fk JOIN sqlite_master m2 ON m2.tbl_name = fk."table" WHERE m1.type = 'table' AND m2.type = 'table';`;

    function exec(sql) {
        try {
            db.exec(sql);
            setError(null);
        } catch (err) {
            setError(err);
        }
    }
    const generatePosition = (index, gridSize = 200) => {
        const row = Math.floor(index / 2);
        const col = index % 2;
        return { x: col * gridSize + 10, y: row * gridSize + 10 };
    };


    function loadData() {
        const tableNames = db.exec( SELECT_TABLES_QRY )[0].values;
        const edgesResult = db.exec(SELECT_FRN_KEYS_QRY);
        const edgesTable = edgesResult.length > 0 ? edgesResult[0].values : [];

        const nodes = tableNames.map((item, index) => ({
            id: item[0],
            data: {label: item[0]},
            position: generatePosition(index),
        }));

        setNodes(nodes)

        const edges = edgesTable.map((item) => ({
            id: `${item[0]}_${item[1]}`,
            source: item[0],
            target: item[1],
        }));

        setEdges(edges)
    }


    return (
        <div>
            <h1>Tables</h1>
            <div style={{display: "flex", alignContent:"flex-end"}}>
                <DatabaseDiagram inputNodes={nodes} inputEdges={edges}/>
                <textarea style={{width: '500px', height: '500px'}}
                          onChange={(e) => exec(e.target.value)}
                          placeholder="Enter some SQL."/>

                <pre className="error">{(error || "").toString()}</pre>
            </div>
            <button onClick={loadData}>Click</button>
            <PopupUpload/>
        </div>

    );
};

export default Tables;
