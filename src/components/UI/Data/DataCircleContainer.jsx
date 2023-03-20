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

    const getPositions = () => {
        return Math.random() * (300 - 20);
    }

    const findCollidingCircles = (circles) => {
        let collisionObjects = [];
        for (let i = 0; i < circles.length; i++) {
            for (let j = i + 1; j < circles.length; j++) {
                if (circles[i].props.left < circles[j].props.left + 30 &&
                    circles[i].props.left + 30 > circles[j].props.left &&
                    300 - circles[i].props.top < 300 - circles[j].props.top + 30 &&
                    300 - circles[i].props.top + 30 > 300 - circles[j].props.top) {
                    collisionObjects.push(circles[i])
                }
            }
        }
        return collisionObjects;
    }

    const checkCollisions = (allCircles) => {
        const collisionObjects = findCollidingCircles(allCircles);

        if (collisionObjects.length === 0) {
            setCircles(allCircles);
            return;
        }

        const newCircles = [...allCircles];
        for (let object of collisionObjects) {
            let newLeft = getPositions(200);
            let newTop = getPositions(200);
            const index = newCircles.findIndex(circle => circle.key === object.key);
            newCircles[index] =
                <DataCircle key={object.key} text={"a"} left={newLeft} top={newTop}/>;
        }

        checkCollisions(newCircles);
    }


    useEffect(() => {
        const values = getAllFromSelectedTable();
        let newCircles = values.map(
            item => <DataCircle
                key={item[0]} text={item[0]}
                left={getPositions(200)} top={getPositions(200)}/>
        );
        checkCollisions(newCircles)
    }, [db]);

    if (error) return <div> Error: {error} </div>;
    return (
        <div id="circle-container">{circles}</div>
    );
};

export default DataCircleContainer;
