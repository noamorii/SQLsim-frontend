import React, {useContext, useEffect, useRef, useState} from "react";
import {DbContext} from "../../../context/context";
import DataCircle from "./DataCircle";
import './DataCircleContainer.css';
import {executeQuery, getStoredQuery} from "../../../context/commonFunctions";

/**
 * DataCircleContainer is a React component that renders DataCircle components in a container with calculated positions.
 * @component
 * @param {Object} props - The properties passed to the component.
 * @returns {JSX.Element} A JSX element representing the container with DataCircles.
 */
const DataCircleContainer = ({condition}) => {
    const [circles, setCircles] = useState([]);
    const [error, setError] = useState(null);

    const {db} = useContext(DbContext);

    const dataCircleRef = useRef(null);
    const circleWidthRef = useRef(null);

    const CIRCLE_BOUNDARY = getCircleWidth();
    const CONTAINER_OFFSET = 125;

    /**
     * getAllFromSelectedTable retrieves data from the selected key stored in session storage
     * by executing its stored query.
     * @function
     * @returns {Object} An object with columns and values of the selected table.
     */
    const getAllFromSelectedTable = () => {
        try {
            const selectAll = getStoredQuery("savedFromQuery");
            const dbResult = executeQuery(db, selectAll);
            return {
                columns: dbResult.columns,
                values: dbResult.values
            }
        } catch (err) {
            setError(err.message);
            return [];
        }
    }

    function getRandomColor() {
        let color = [];
        for(let i = 0; i < 3; i++) {
            let component = Math.floor(Math.random() * 128) + 128;
            color.push(component.toString(16).padStart(2, '0'));
        }
        return '#' + color.join('');
    }

    const getQueryResult = () => {
        try {
            const query = getStoredQuery("savedSelectQuery");
            const dbResult = executeQuery(db, query);
            if (dbResult.length === 0) return;
            const newCircles = dbResult.values.map((value, index) => {
                const keyValueObject = createKeyValueObject(dbResult.columns, value);
                return (
                    <DataCircle key={value[0] + index} text={index+1} valueObject={keyValueObject}
                                left={getPositions()} top={getPositions()} backgroundColor="#a0b3bd"/>
                );
            });
            return checkCollisions(newCircles);
        } catch (err) {
            setError(err.message);
            return [];
        }
    }

    const getWhereClause = (query) => {
        let start = query.indexOf("WHERE");
        let end = query.indexOf("GROUP BY") !== -1 ? query.indexOf("GROUP BY") : query.indexOf("ORDER BY");
        if (start !== -1) {
            console.log(query.substring(start, end !== -1 ? end : undefined))
            return query.substring(start, end !== -1 ? end : undefined);
        }

        return "";
    }

    const getGroupByParams = (query) => {
        let start = query.indexOf("GROUP BY") + 9;
        let end = query.indexOf("ORDER BY") !== -1 ? query.indexOf("ORDER BY") : query.indexOf("HAVING");
        if (start !== -1)
            return query.substring(start, end !== -1 ? end : undefined);
        return "";
    }

    const getWhereConditionElements = () => {
        const fromQuery = getStoredQuery("savedFromQuery");
        const wholeQuery = getStoredQuery("savedSelectQuery")
        const query = fromQuery + " " + getWhereClause(wholeQuery);
        if (query.includes("WHERE")) {
            try {
                const dbResult = executeQuery(db, query);
                return {
                    columns: dbResult.columns,
                    values: dbResult.values
                }
            } catch (err) {
                setError(err.message);
                return [];
            }
        }
        return [];
    }

    const getFilteredCircles = () => {
        let objects = [];
        let conditionElements = getWhereConditionElements();
        if (conditionElements.length === 0) return;
        conditionElements.values.map(value => {
            objects.push(createKeyValueObject(conditionElements.columns, value))
        });

        if (objects.length === 0) return;

        return circles.map((circle) => {
            const isValueObjectInObjects = objects.some(
                (object) => JSON.stringify(object) === JSON.stringify(circle.props.valueObject)
            );

            if (isValueObjectInObjects) {
                return (
                    <DataCircle
                        key={circle.props.key}
                        text={circle.props.text}
                        valueObject={circle.props.valueObject}
                        left={circle.props.left}
                        top={circle.props.top}
                        backgroundColor="rgb(184 160 189)"
                    />
                );
            }
            return circle;
        });
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

        if (collisionObjects.length === 0)
            return allCircles

        const newCircles = [...allCircles];
        for (let object of collisionObjects) {
            const index = newCircles.findIndex(circle => circle.key === object.key);
            newCircles[index] =
                <DataCircle key={object.key} text={object.props.text} valueObject={object.props.valueObject}
                            left={getPositions()} top={getPositions()} backgroundColor="#a0b3bd"/>;
        }
        return checkCollisions(newCircles);
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
     */
    useEffect(() => {
        const dbResultObject = getAllFromSelectedTable();
        if (dbResultObject.length === 0) return;
        const newCircles = dbResultObject.values.map((value, index) => {
            const keyValueObject = createKeyValueObject(dbResultObject.columns, value);
            return (
                <DataCircle key={value[0] + index} text={index+1} valueObject={keyValueObject}
                            left={getPositions()} top={getPositions()} backgroundColor="#a0b3bd"/>
            );
        });
        const circles = checkCollisions(newCircles);
        setCircles(circles);
    }, [db]);

    function getCircleParamValues(circle, params) {
        return params.reduce((acc, param) => `${acc},${circle.props.valueObject[param.trim()]}`, "");
    }

    function getGroupedCircles() {
        const query = getStoredQuery("savedSelectQuery");
        const params = getGroupByParams(query).split(",");
        if (!params.length) return;

        let duplicates = circles.reduce((acc, circle1, index1) => {
            const isDuplicate = circles.some((circle2, index2) =>
                index1 !== index2 &&
                params.some(param =>
                    circle1.props.valueObject[param.trim()] === circle2.props.valueObject[param.trim()]
                )
            );
            if (isDuplicate) acc.push(circle1);
            return acc;
        }, []);

        let colorMap = duplicates.reduce((acc, circle) => {
            const value = getCircleParamValues(circle, params);
            if(!acc[value]) {
                acc[value] = getRandomColor();
            }
            return acc;
        }, {});

        return circles.map(circle => {
            if (duplicates.includes(circle)) {
                const newBackground = colorMap[getCircleParamValues(circle, params)];
                return (
                    <DataCircle
                        {...circle.props}
                        key={circle.props.key}
                        backgroundColor={newBackground}
                    />
                );
            } else {
                return circle;
            }
        });
    }


    const renderCircles = () => {
        if (condition === "FROM")
            return getQueryResult();
        if (condition === "WHERE")
            return getFilteredCircles();
        if (condition === "GROUP BY")
            return getGroupedCircles();
        return circles;
    }

    if (error) return <div> Error: {error} </div>;
    return (
        <div id="circleContainer" ref={dataCircleRef}>
            {renderCircles()}
        </div>
    );
};

export default DataCircleContainer;
