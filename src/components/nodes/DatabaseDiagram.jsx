import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import ReactFlow, {applyNodeChanges, Background, Controls, MiniMap} from 'reactflow';
import 'reactflow/dist/style.css';
import "./DatabaseDiagram.css"
import AttributeNode from "./AttributeNode";
import {DbContext} from "../context/context";
import {GET_ALL_TABLES_DATA_QRY, SELECT_FRN_KEYS_QRY} from "../context/DbQueryConsts";

const defaultViewport = {x: 0, y: 0, zoom: 1.5};
const nodeTypes = {attributeNode: AttributeNode};

const DatabaseDiagram = () => {
    const {db} = useContext(DbContext);

    const randomPosition = (areaWidth = 800, areaHeight = 800) => {
        const x = Math.random() * areaWidth;
        const y = Math.random() * areaHeight;
        return {x, y};
    }

    const getEdges = useMemo(() => {
        try {
            const keyData = db.exec(SELECT_FRN_KEYS_QRY)[0].values;
            return keyData.map(([table_from, attribute, table_to, attr]) => ({
                id: `${table_from}_${attribute}_to_${table_to}_${attr}`,
                source: `${table_from}_${attribute}`,
                target: `${table_to}_${attr}`,
                label: `FK_${table_from}_${attribute}=${table_to}_${attr}`,
                labelStyle: { fill: 'gray' },
            }));
        } catch (err) {
            return [];
        }
    }, [db]);


    const getNodes = useMemo(() => {
        try {
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
                        label: attrName, dataType: types[i]
                    },
                    type: "attributeNode",
                    draggable: false,
                    position: {x: 10, y: startOffset + attributeHeight * i},
                    parentNode: tableName,
                    extent: "parent",
                }));
                return [tableNode, ...attributeNodes];
            });
        } catch (err) {
            return [];
        }
    }, [db]);

    const [nodes, setNodes] = useState(getNodes);
    const [edges, setEdges] = useState(getEdges);

    useEffect(() => {
        setNodes(getNodes);
        setEdges(getEdges);
    }, [db]);

    const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            nodeTypes={nodeTypes}
            defaultViewport={defaultViewport}
            fitView
            attributionPosition="bottom-right">
            <MiniMap nodeColor="#A7ACBEFF" zoomable pannable/>
            <Controls/>
            <Background color="#aaa" className="background"/>
        </ReactFlow>
    );
};

export default DatabaseDiagram;
