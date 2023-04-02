import React, {useContext, useState} from 'react';
import DatabaseDiagram from "../components/nodes/DatabaseDiagram";
import {DbContext} from "../components/context/context";
import PopupUpload from "../components/UI/PopupUpload";
import {SELECT_FRN_KEYS_QRY, SELECT_TABLES_QRY} from "../components/context/DbQueryConsts";

const Tables = () => {

    const [error, setError] = useState(null);
    const [edges, setEdges] = useState([]);
    const [nodes, setNodes] = useState([]);

    const {db} = useContext(DbContext);

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
                <div style={{ width: '100%', height: '500px' }}>
                    <DatabaseDiagram inputNodes={nodes} inputEdges={edges}/>
                </div>
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
