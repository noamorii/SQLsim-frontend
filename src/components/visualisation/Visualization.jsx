import React from 'react';
import DataCircleContainer from "./circles/DataCircleContainer";

/**
 * Visualization component displays the visualization of data using DataCircleContainer.
 * It receives a query as a prop and passes it to the DataCircleContainer component to fetch and visualize the data.
 *
 * @param {string} query - The query used to fetch the data for visualization.
 * @returns {JSX.Element} - The rendered Visualization component.
 */
const Visualization = ({query}) => {
    return (
        <div className="visualization">
            <DataCircleContainer queryKey={query}/>
        </div>
    );
};

export default Visualization;
