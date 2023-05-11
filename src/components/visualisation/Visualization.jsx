import React, {useState} from 'react';
import DataCircleContainer from "./circles/DataCircleContainer";
import Button from "../UI/Buttons/Button";
import "./Visualization.css"

/**
 * Visualization component displays the visualization of data using DataCircleContainer.
 * It receives a query as a prop and passes it to the DataCircleContainer component to fetch and visualize the data.
 *
 * @returns {JSX.Element} - The rendered Visualization component.
 */
const Visualization = () => {
    const conditions = ["SELECT", "WHERE", "ALL"];
    const conditions_text = ["All elements", "WHERE condition-matching elements", "All conditions-satisfying elements"];

    const [currentConditionIndex, setCurrentConditionIndex] = useState(0);

    const lowerIndex = () => {
        const newIndex = currentConditionIndex - 1;
        if (newIndex >= 0) setCurrentConditionIndex(newIndex);
    };

    const increaseIndex = () => {
        const newIndex = currentConditionIndex + 1;
        if (newIndex < conditions.length) setCurrentConditionIndex(newIndex);
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
