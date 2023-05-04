import React, {useState, useEffect, useContext, useRef} from "react";
import {DbContext} from "../../context/context";
import DataCircle from "./DataCircle";
import './DataCircleContainer.css';
import {executeQuery, getStoredQuery} from "../../context/commonFunctions";

/**
 * DataCircleContainer is a React component that renders DataCircle components in a container with calculated positions.
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.queryKey - The key used to fetch the query from session storage.
 * @returns {JSX.Element} A JSX element representing the container with DataCircles.
 */
const DataCircleContainer = ({queryKey}) => {
    console.log(queryKey)
    const [circles, setCircles] = useState([]);
    const [error, setError] = useState(null);

    const {db} = useContext(DbContext);

    const dataCircleRef = useRef(null);
    const circleWidthRef = useRef(null);

    const CIRCLE_BOUNDARY = getCircleWidth();
    const CONTAINER_OFFSET = 100;

    /**
     * getAllFromSelectedTable retrieves data from the selected key stored in session storage
     * by executing its stored query.
     * @function
     * @returns {Object} An object with columns and values of the selected table.
     */
    const getAllFromSelectedTable = () => {
        try {
            const query = getStoredQuery(queryKey);
            const dbResult = executeQuery(db, query);
            return {
                columns:dbResult.columns,
                values: dbResult.values
            }
        } catch (err) {
            setError(err.message);
            return [];
        }
    }

    /**
     * getPositions calculates a random position value for the DataCircle in the container.
     * @function
     * @returns {number} A random position value.
     */
    const getPositions = () => {
        return Math.random() * (dataCircleRef.current.offsetWidth - CIRCLE_BOUNDARY - CONTAINER_OFFSET);
    }

    /**
     * getCircleWidth calculates the width of the DataCircle.
     * @function
     * @returns {number|null} The width of the DataCircle.
     */
    function getCircleWidth() {
        if (circleWidthRef.current)
            return circleWidthRef.current;

        const circle = document.createElement('div');
        circle.setAttribute('id', 'circle-');
        document.body.appendChild(circle);
        const computedStyle = getComputedStyle(circle);
        const circleWidth = parseInt(computedStyle.width, 10);
        document.body.removeChild(circle);
        circleWidthRef.current = circleWidth;
        return circleWidth;
    }

    /**
     * findCollidingCircles finds the DataCircles that are colliding with each other.
     * @function
     * @param {Array} circles - An array of DataCircle components.
     * @returns {Array} An array of DataCircle components that are colliding.
     */
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

    /**
     * checkCollisions checks for collisions and sets the position of the colliding DataCircles.
     * @function
     * @param {Array} allCircles - An array of all DataCircle components.
     */
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

    /**
     * createKeyValueObject creates an object with keys and values from the given arrays.
     * @function
     * @param {Array} columns - An array of column names.
     * @param {Array} values - An array of values corresponding to the column names.
     * @returns {Object} An object with keys and values.
     */
    const createKeyValueObject = (columns, values) =>
        columns.reduce((obj, column, i) => ({...obj, [column]: values[i]}), {});

    /**
     * useEffect hook: Fetches data from the selected query stored in session storage,
     * creates new DataCircle components, and checks for collisions.
     * It runs when the 'db' or 'queryKey' dependencies change.
     */
    useEffect(() => {
        const dbResultObject = getAllFromSelectedTable();
        if (dbResultObject.length === 0) return;
        const newCircles = dbResultObject.values.map(value => {
            const keyValueObject = createKeyValueObject(dbResultObject.columns, value);
            return (
                <DataCircle key={value[0]} text={value[0]} valueObject={keyValueObject}
                left={getPositions()} top={getPositions()} />
            );
        });
        checkCollisions(newCircles)
    }, [db, queryKey]);

    if (error) return <div> Error: {error} </div>;
    return (
        <div id="circleContainer" ref={dataCircleRef}>{circles}</div>
    );
};

export default DataCircleContainer;
