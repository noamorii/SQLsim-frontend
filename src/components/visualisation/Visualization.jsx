import React from 'react';
import DataCircleContainer from "./circles/DataCircleContainer";

const Visualization = ({query}) => {
    return (
        <div className="visualization">
            <DataCircleContainer queryKey={query}/>
        </div>
    );
};

export default Visualization;
