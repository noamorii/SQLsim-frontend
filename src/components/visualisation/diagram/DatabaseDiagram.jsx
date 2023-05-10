import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import ReactFlow, {applyNodeChanges, Background, Controls, MarkerType, MiniMap} from 'reactflow';
import 'reactflow/dist/style.css';
import "./DatabaseDiagram.css"
import AttributeNode from "../nodes/AttributeNode";
import {DbContext} from "../../../context/context";
import {GET_ALL_TABLES_DATA_QRY, SELECT_FRN_KEYS_QRY} from "../../../context/DbQueryConsts";

const defaultViewport = {x: 0, y: 0, zoom: 1.5};
const nodeTypes = {attributeNode: AttributeNode};

/**
 * DatabaseDiagram component displays an interactive database diagram using ReactFlow.
 * The diagram includes nodes representing tables and their attributes, and edges representing foreign key relationships.
 * The component also provides zoom and pan controls for easy navigation.
 */
const DatabaseDiagram = () => {
    const {db} = useContext(DbContext);

    /**
     * Generates a random position for the nodes within the specified area.
     *
     * @param {number} areaWidth - The width of the area where the nodes will be positioned. Default is 800.
     * @param {number} areaHeight - The height of the area where the nodes will be positioned. Default is 800.
     * @returns {{x: number, y: number}} - An object containing x and y coordinates.
     */
    const randomPosition = (areaWidth = 800, areaHeight = 800) => {
        const x = Math.random() * areaWidth;
        const y = Math.random() * areaHeight;
        return {x, y};
    }

    /**
     * useMemo hook: Generates the edges based on foreign key relationships.
     */
    const getEdges = useMemo(() => {
        try {
            const keyData = db.exec(SELECT_FRN_KEYS_QRY)[0].values;
            return keyData.map(([table_from, attribute, table_to, attr]) => ({
                id: `${table_from}_${attribute}_to_${table_to}_${attr}`,
                source: `${table_from}_${attribute}`,
                target: `${table_to}_${attr}`,
                label: `FK_${table_from}_${attribute}=${table_to}_${attr}`,
                labelStyle: { fill: 'gray' },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 16, height: 16,
                    color: '#64a1a4'
                },
                style: {
                    strokeWidth: 2,
                    stroke: '#64a1a4',
                },
            }));
        } catch (err) {
            return [];
        }
    }, [db]);

    /**
     * useMemo hook: Generates the nodes based on the tables and their attributes.
     */
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

    /**
     * useEffect hook: Updates the nodes and edges when the 'db' dependency changes.
     */
    useEffect(() => {
        setNodes(getNodes);
        setEdges(getEdges);
    }, [db]);

    /**
     * useCallback hook: Updates the nodes based on the changes.
     */
    const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]);

    return (
        <div className="databaseDiagram">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                nodeTypes={nodeTypes}
                defaultViewport={defaultViewport}
                fitView
                attributionPosition="bottom-right">
                <MiniMap nodeColor="#A7ACBEFF" position="bottom-left" zoomable pannable/>
                <Controls position="top-left"/>
                <Background color="#aaa" className="background"/>
            </ReactFlow>
        </div>
    );
};

export default DatabaseDiagram;
