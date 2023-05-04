import React from 'react';
import {Handle, Position} from "reactflow";
import "./AttributeNode.css";

/**
 * AttributeNode component represents an attribute node in the database diagram.
 * It displays the attribute name and data type.
 * It also provides handles for connecting edges to the attribute node.
 *
 * @param {Object} data - The data props passed to the component.
 * @param {string} data.data.id - The unique identifier of the attribute node.
 * @param {string} data.data.label - The label or name of the attribute.
 * @param {string} data.data.dataType - The data type of the attribute.
 * @returns {JSX.Element} - The rendered AttributeNode component.
 */
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
