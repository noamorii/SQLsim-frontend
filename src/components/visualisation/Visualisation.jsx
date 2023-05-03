import React, {useContext} from 'react';
import DataCircleContainer from "./circles/DataCircleContainer";
import {executeQueryValues, getStoredQuery} from "../context/commonFunctions";
import {DbContext} from "../context/context";

const Visualisation = (isShowed) => {

    const {db} = useContext(DbContext);

    const getValues = () => {
        const query = getStoredQuery('savedSelectQuery');
        const result =  executeQueryValues(db, query);
        console.log(result)
        return result;
    }

    return (
        <div className="visualization">
            {isShowed && <DataCircleContainer/>}
        </div>
    );
};

export default Visualisation;
