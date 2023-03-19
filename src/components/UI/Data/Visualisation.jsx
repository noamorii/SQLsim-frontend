import React, { useState} from 'react';
import DataCircleContainer from "./DataCircleContainer";

const Visualisation = () => {
    const [isShown, setIsShown] = useState(false);

    const toggleIsShown = () => setIsShown(prev => !prev);

    return (
        <>
            <button onClick={toggleIsShown}>Click</button>
            {isShown && <DataCircleContainer />}
        </>
    );
};

export default Visualisation;
