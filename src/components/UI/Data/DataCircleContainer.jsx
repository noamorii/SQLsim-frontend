import React, {useState, useEffect, useContext, useRef} from "react";
import {DbContext} from "../../context/context";
import DataCircle from "./DataCircle";
import './DataCircleContainer.css';
import ResultTable from "../Table/Result/ResultTable";

const DataCircleContainer = () => {
    const [circles, setCircles] = useState([]);
    const [dbResult, setDbResult] = useState([]);
    const [error, setError] = useState(null);
    const {db} = useContext(DbContext);
    const dataCircleRef = useRef(null);
    const circleWidthRef = useRef(null);

    const CIRCLE_BOUNDARY = getCircleWidth();
    const CONTAINER_OFFSET = 20;

    const getAllFromSelectedTable = () => {
        try {
            const dbResult = db.exec("Select * from employees;")[0];
            return {
                columns:dbResult.columns,
                values: dbResult.values
            }
        } catch (err) {
            setError(err.message);
            return [];
        }
    }

    const getPositions = () => {
        return Math.random() * (dataCircleRef.current.offsetWidth - CIRCLE_BOUNDARY - CONTAINER_OFFSET);
    }

    function getCircleWidth() {
        if (circleWidthRef.current) {
            return circleWidthRef.current;
        } else {
            const circle = document.createElement('div');
            circle.setAttribute('id', 'circle-');
            document.body.appendChild(circle);
            const computedStyle = getComputedStyle(circle);
            const circleWidth = parseInt(computedStyle.width, 10);
            document.body.removeChild(circle);
            circleWidthRef.current = circleWidth;
            return circleWidth;
        }
    }

    const findCollidingCircles = (circles) => {
        let collisionObjects = [];
        const containerWidth = dataCircleRef.current.offsetWidth;
        for (let i = 0; i < circles.length; i++) {
            for (let j = i + 1; j < circles.length; j++) {
                if (circles[i].props.left < circles[j].props.left + CIRCLE_BOUNDARY &&
                    circles[i].props.left + CIRCLE_BOUNDARY > circles[j].props.left &&
                    containerWidth - circles[i].props.top < containerWidth - circles[j].props.top + CIRCLE_BOUNDARY &&
                    containerWidth - circles[i].props.top + CIRCLE_BOUNDARY > containerWidth - circles[j].props.top) {
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
            const index = newCircles.findIndex(circle => circle.key === object.key);
            newCircles[index] =
                <DataCircle key={object.key} text={object.props.text}
                            valueObject={object.props.valueObject}
                            left={getPositions()} top={getPositions()}/>;
        }
        checkCollisions(newCircles);
    }

    const createKeyValueObject = (columns, values) =>
        columns.reduce((obj, column, i) => ({...obj, [column]: values[i]}), {});

    useEffect(() => {
        const dbResultObject = getAllFromSelectedTable();
        console.log(dbResultObject)
        setDbResult(dbResultObject);
        const newCircles = dbResultObject.values.map(value => {
            const keyValueObject = createKeyValueObject(dbResultObject.columns, value);
            return <DataCircle
                key={value[0]} text={value[0]} valueObject={keyValueObject}
                left={getPositions()} top={getPositions()} />;
        });
        checkCollisions(newCircles)
    }, [db]);

    if (error) return <div> Error: {error} </div>;
    return (
        <div>
            <div id="circleContainer" ref={dataCircleRef}>{circles}</div>
            <ResultTable data={getAllFromSelectedTable()}/>
        </div>

    );
};

export default DataCircleContainer;
