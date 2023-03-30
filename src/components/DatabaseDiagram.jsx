import ReactFlow, { useNodesState, useEdgesState, MiniMap, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import './DatabaseDiagram.css';
import {useEffect} from "react";

const minimapStyle = {
    height: 120,
};

const DatabaseDiagram = ({inputNodes, inputEdges}) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(inputNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(inputEdges);

    useEffect(() => {
        setNodes(inputNodes);
        setEdges(inputEdges);
    }, [inputNodes, inputEdges]);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
        >
            <MiniMap style={minimapStyle} zoomable pannable />
            <Controls />
        </ReactFlow>
    );
};

export default DatabaseDiagram;

