import React, {useCallback, useContext} from 'react';
import ReactFlow, {
    useNodesState,
    useEdgesState,
    addEdge,
    MiniMap,
    Controls,
    applyEdgeChanges,
    applyNodeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';

import "./DatabaseDiagram.css"
import 'reactflow/dist/style.css';
import AttributeNode from "./AttributeNode";
import {DbContext} from "../context/context";
import {GET_ALL_TABLES_DATA_QRY} from "../context/DbQueryConsts";


const initBgColor = '#1A192B';

const connectionLineStyle = {stroke: '#fff'};
const snapGrid = [20, 20];
const defaultViewport = {x: 0, y: 0, zoom: 1.5};

const nodeTypes = {attributeNode: AttributeNode};


const DatabaseDiagram = () => {
    const {db} = useContext(DbContext);

    const [edges, setEdges] = useEdgesState([]);

    function parseTables() {
        const res = db.exec(GET_ALL_TABLES_DATA_QRY)[0].values;
        const attributeHeight = 25;
        let nodes = [];
        for (let table of res) {
            nodes.push({
                id: table[0],
                data: {label: table[0]},
                position: {x: 0, y: 0},
                style: {
                    width: 170,
                    height: 30 + (table[1] * attributeHeight) ,
                }
            })
            const attributes = table[2].split(',');

            for (let i = 0; i < attributes.length; i++) {
                nodes.push({
                    id: table[0] + "_" + attributes[i],
                    data: {label: attributes[i]},
                    type: 'attributeNode',
                    draggable: false,
                    position: {x: 10, y: 30 + (25 * i)},
                    parentNode: table[0],
                    extent: 'parent',
                })
            }
        }
        return nodes;
    }

    const nodess = parseTables();
    const [nodes, setNodes] = useNodesState(nodess);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );
    const onConnect = useCallback(
        (connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            style={{background: initBgColor}}
            connectionLineStyle={connectionLineStyle}
            snapToGrid={true}
            snapGrid={snapGrid}
            defaultViewport={defaultViewport}
            fitView
            attributionPosition="bottom-left"
        >
            <MiniMap zoomable pannable/>
            <Controls/>
        </ReactFlow>
    );
};

export default DatabaseDiagram;
