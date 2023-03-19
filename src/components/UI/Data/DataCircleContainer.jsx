import React, {useState, useEffect, useContext} from "react";
import {DbContext} from "../../context/context";
import DataCircle from "./DataCircle";
import './DataCircleContainer.css';

const DataCircleContainer = () => {
    const [circles, setCircles] = useState([]);
    const [error, setError] = useState(null);
    const {db} = useContext(DbContext);

    const getAllFromSelectedTable = () => {
        try {
            return db.exec("Select * from employees;")[0].values;
        } catch (err) {
            setError(err.message);
            return [];
        }
    }

    useEffect(() => {
        const values = getAllFromSelectedTable();
        const newCircles = values.map(item => <DataCircle key={item[0]} text={item[0]} />);
        setCircles(newCircles);
    }, [db]);

    if (error) return <div> Error: {error} </div>;
    return (
        <div id="circleContainer">{circles}</div>
    );
};

export default DataCircleContainer;
