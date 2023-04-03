import React, {useCallback, useContext} from 'react';
import ReactFlow, {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Controls,
    MiniMap,
    useEdgesState,
    useNodesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import "./DatabaseDiagram.css"
import AttributeNode from "./AttributeNode";
import {DbContext} from "../context/context";
import {GET_ALL_TABLES_DATA_QRY, SELECT_FRN_KEYS_QRY} from "../context/DbQueryConsts";

const initBgColor = '#1A192B';
const connectionLineStyle = {stroke: '#fff'};
const snapGrid = [20, 20];
const defaultViewport = {x: 0, y: 0, zoom: 1.5};
const nodeTypes = {attributeNode: AttributeNode};

const DatabaseDiagram = () => {
    const {db} = useContext(DbContext);

    function randomPosition(areaWidth = 800, areaHeight = 800) {
        const x = Math.random() * areaWidth;
        const y = Math.random() * areaHeight;
        return { x: x, y: y };
    }
    function getData2() {
        try {
            return getEdges();
        } catch (err) {
            return [];
        }
    }

    function getData() {
        try {
            return parse();
        } catch (err) {
            return [];
        }
    }

    function getEdges() {
        const keyData = db.exec(SELECT_FRN_KEYS_QRY)[0].values;
        return keyData.map(([table_from, attribute, table_to, attr]) => ({
            id: `${table_from}_${attribute}_to_${table_to}_${attr}`,
            source: `${table_from}_${attribute}`,
            target: `${table_to}_${attr}`,
            label: `FK_${table_from}_${attribute}=${table_to}_${attr}`,
            labelStyle: { fill: 'gray' },
        }));
    }

    function parse() {
        const tablesData = db.exec(GET_ALL_TABLES_DATA_QRY)[0].values;
        const attributeHeight = 25;
        const startOffset = 30;
        return tablesData.flatMap(([tableName, numAttributes, attributes, dataTypes]) => {
            const tableNode = {
                id: tableName,
                data: {label: tableName},
                position: randomPosition(),
                style: {width: 170, height: startOffset + numAttributes * attributeHeight},
            };
            const types = dataTypes.split(",");
            const attributeNodes = attributes.split(",").map((attrName, i) => ({
                id: `${tableName}_${attrName}`,
                data: {
                    label: attrName,
                    dataType: types[i]
                },
                type: "attributeNode",
                draggable: false,
                position: {x: 10, y: startOffset + attributeHeight * i},
                parentNode: tableName,
                extent: "parent",
            }));
            return [tableNode, ...attributeNodes];
        });
    }

    const nodess = getData();
    const edgess = getData2();
    const [nodes, setNodes] = useNodesState(nodess);
    const [edges, setEdges] = useEdgesState(edgess);

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
