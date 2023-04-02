import React from 'react';
import {Handle, Position} from "reactflow";
import "./AttributeNode.css";

const AttributeNode = (data) => {
    return (
        <div className="attribute_node">
            <Handle type="source" position={Position.Left}/>
            <label> {data.data.label} </label>
            <Handle type="source" position={Position.Right}/>
        </div>
    );
};

export default AttributeNode;
