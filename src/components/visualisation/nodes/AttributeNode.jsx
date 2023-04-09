import React from 'react';
import {Handle, Position} from "reactflow";
import "./AttributeNode.css";

const AttributeNode = (data) => {
    return (
        <div className="attribute_node">
            <Handle type="target" position={Position.Left} id={data.data.id}/>
            <div className="attribute_wrapper">
                <div className="attribute_name"> {data.data.label} </div>
                <div className="attribute_type"> {data.data.dataType} </div>
            </div>
            <Handle type="source" position={Position.Right} id={data.data.id}/>
        </div>
    );
};

export default AttributeNode;
