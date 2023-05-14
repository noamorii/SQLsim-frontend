import React, {useEffect, useState} from 'react';
import DataCircleContainer from "./circles/DataCircleContainer";
import Button from "../UI/Buttons/Button";
import "./Visualization.css"
import {getStoredQuery} from "../../context/commonFunctions";

/**
 * Visualization component displays the visualization of data using DataCircleContainer.
 * It receives a query as a prop and passes it to the DataCircleContainer component to fetch and visualize the data.
 *
 * @returns {JSX.Element} - The rendered Visualization component.
 */
const Visualization = () => {
    const conditions = ["SELECT", "WHERE", "GROUP BY", "FROM"];
    const conditions_text = ["All elements", "WHERE satisfying elements", "Grouped objects", "Result elements"];

    const [currentConditionIndex, setCurrentConditionIndex] = useState(0);
    let storedQuery = "";

    useEffect(() => {
        storedQuery = getStoredQuery("savedFromQuery");
    }, []);

    const lowerIndex = () => {
        let newIndex = currentConditionIndex - 1;
        while (!storedQuery.includes(conditions[newIndex]) && newIndex >= 0) {
            newIndex--;
        }
        setCurrentConditionIndex(newIndex);
    };

    const increaseIndex = () => {
        let newIndex = currentConditionIndex + 1;
        while (!storedQuery.includes(conditions[newIndex]) && newIndex < conditions.length) {
            newIndex++;
        }
        setCurrentConditionIndex(newIndex);
    };

    return (
        <div className="visualization">
            <div className="queryControls">
                <Button text="Back" onClick={lowerIndex} disabled={currentConditionIndex === 0}/>
                <Button text="Next" onClick={increaseIndex} disabled={currentConditionIndex === conditions.length - 1}/>
                <span className="condition">{conditions_text[currentConditionIndex]}</span>
            </div>
            <DataCircleContainer condition={conditions[currentConditionIndex]}/>
        </div>
    );
};

export default Visualization;
