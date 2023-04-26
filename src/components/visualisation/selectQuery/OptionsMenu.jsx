import React from 'react';
import {AGGREGATE_FUNCTIONS, BASIC_OPERATIONS, CONDITIONS, OUTPUT_MODIFICATIONS} from "../../context/DbQueryConsts";
import {MdDragHandle} from "react-icons/md";
import "./OptionsMenu.css";

const OptionsMenu = () => {
    const renderOperationList = (label, operations) => (
        <div className="optionsContainer">
            <label>{label}:</label>
            <ul>
                {operations.map((operationType, index) => (
                    <li key={index} draggable={true}>
                        <MdDragHandle />
                        {operationType}
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="menu">
            <label className="options">Options</label>
            {renderOperationList('Basic operations', BASIC_OPERATIONS)}
            {renderOperationList('Output modifications', OUTPUT_MODIFICATIONS)}
            {renderOperationList('Conditions', CONDITIONS)}
            {renderOperationList('Aggregation functions', AGGREGATE_FUNCTIONS)}
        </div>
    );
};

export default OptionsMenu;
