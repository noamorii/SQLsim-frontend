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


const nodess = [
    {
        id: 'A',
        data: {label: 'Parent node xui'},
        position: {x: 0, y: 0},
        style: {
            width: 170,
            height: 140,
        }
    },
    {
        id: 'B',
        data: {label: 'child node 1'},
        type: 'attributeNode',
        draggable: false,
        position: {x: 10, y: 30},
        parentNode: 'A',
        extent: 'parent',
    },
    {
        id: 'C',
        data: {label: 'child node 1'},
        type: 'attributeNode',
        draggable: false,
        position: {x: 10, y: 52},
        parentNode: 'A',
        extent: 'parent',
    },
    {
        id: 'D',
        data: {label: 'child node 1'},
        type: 'attributeNode',
        draggable: false,
        position: {x: 10, y: 90},
        parentNode: 'A',
        extent: 'parent',
    },
    {
        id: 'E',
        type: 'attributeNode',
        data: {label: 'child node 2'},
        position: {x: 10, y: 120},
        parentNode: 'A',
        draggable: false,
        extent: 'parent',
    },


    {
        id: 'AA',
        data: {label: 'Parent node xui'},
        position: {x: 100, y: 100},
        style: {
            width: 170,
            height: 140,
        }
    },
    {
        id: 'BA',
        data: {label: 'child node 1'},
        type: 'attributeNode',
        draggable: false,
        position: {x: 10, y: 30},
        parentNode: 'AA',
        extent: 'parent',
    },
    {
        id: 'CA',
        data: {label: 'child node 1'},
        type: 'attributeNode',
        draggable: false,
        position: {x: 10, y: 52},
        parentNode: 'AA',
        extent: 'parent',
    },
    {
        id: 'DA',
        data: {label: 'child node 1'},
        type: 'attributeNode',
        draggable: false,
        position: {x: 10, y: 90},
        parentNode: 'AA',
        extent: 'parent',
    },
    {
        id: 'EA',
        type: 'attributeNode',
        data: {label: 'child node 2'},
        position: {x: 10, y: 120},
        parentNode: 'AA',
        draggable: false,
        extent: 'parent',
    }
];
const DatabaseDiagram = () => {
    const {db} = useContext(DbContext);
    const [nodes, setNodes] = useNodesState(nodess);
    const [edges, setEdges] = useEdgesState([]);

    function parseTables() {
        const res = db.exec(GET_ALL_TABLES_DATA_QRY)[0].values;
        const attributeHeight = 30;
        let nodes = [];
        for (let table of res) {
            nodes.push({
                id: table[0],
                data: {label: 'Parent node xui'},
                position: {x: 0, y: 0},
                style: {
                    width: 170,
                    height: table[1] * attributeHeight + 10,
                }
            })
            const attributes = table[2].split(',');

            for (let i = 0; i < attributes.length; i++) {
                nodes.push({
                    id: table[0] + "_" + attributes[i],
                    data: {label: attributes[i]},
                    type: 'attributeNode',
                    draggable: false,
                    position: {x: 10, y: 30 + (22 * i)},
                    parentNode: table[0],
                    extent: 'parent',
                })
            }
        }
    }


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
            <MiniMap/>
            <Controls/>
        </ReactFlow>
    );
};

export default DatabaseDiagram;
