import React from 'react';
import DataCircleContainer from "./circles/DataCircleContainer";

const Visualisation = ({query}) => {
    console.log(query)
    return (
        <div className="visualization">
            <DataCircleContainer queryKey={query}/>
        </div>
    );
};

export default Visualisation;
