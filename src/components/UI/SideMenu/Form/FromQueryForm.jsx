import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {DbContext} from "../../../context/context";
import {executeQueryValues} from "../../../context/commonFunctions";
import {SELECT_TABLES_QRY} from "../../../context/DbQueryConsts";
import './FromQueryForm.css';
import PopupUpload from "../../Popup/PopupUpload";
import DbFileDownloadButton from "../../Buttons/DbFileDownloadButton";
import Button from "../../Buttons/Button";
import {AiFillDelete} from "react-icons/ai";
import {VscDebugStart} from "react-icons/vsc";

const startElements = [<div className="start element">FROM</div>];

/**
 * The FromQueryForm component builds a SQL query based on user-selected options.
 * It allows users to create, edit, and execute SQL queries by dragging and
 * dropping elements onto the form. Users can also upload and download database files.
 *
 * @component
 * @param {Object} props - The component's props.
 * @param {Function} props.showResultTable - Function to display the result table.
 * @param {Function} props.clearResultTable - Function to clear the result table.
 * @returns {JSX.Element} The rendered component.
 */
const FromQueryForm = ({showResultTable, clearResultTable}) => {
    const {db} = useContext(DbContext);

    const [elements, setElements] = useState(startElements);
    const [queryError, setQueryError] = useState(null);
    const [tables, setTables] = useState([]);
    const {register, unregister, handleSubmit} = useForm();

    /**
     * Fetches the list of tables from the database.
     *
     * @function
     * @returns {Function} An async function that fetches the list of tables.
     */
    const fetchTables = useMemo(() => {
        return async () => {
            const allTables = executeQueryValues(db, SELECT_TABLES_QRY);
            setTables(allTables);
        };
    }, [db]);

    useEffect(() => {
        fetchTables().catch((error) => {
            console.error('Error fetching tables:', error);
        });
    }, [fetchTables]);

    /**
     * useEffect - Clears the query error message after 5 seconds and cleans up the timer on component unmount or error change.
     */
    useEffect(() => {
        if (queryError) {
            const timer = setTimeout(() => {
                setQueryError(null);
            }, 5000); // Clear the error after 5 seconds

            return () => {
                clearTimeout(timer);
            };
        }
    }, [queryError]);

    /**
     * Loads an array of React elements based on an array of element JSON objects stored in session storage.
     *
     * @function
     * @param {Array<Object>} elementsJson - An array of parsed JSON objects.
     * @returns {Array<JSX.Element>} An array of React elements.
     */
    const loadElementFromDataFromSession = (elementsJson) => {
        return elementsJson.map((element, index) => {
            const { type, props } = element;

            if (type === "div") {
                const { className, children } = props;
                return <div className={className}>{children}</div>;
            }

            if (type === "select") {
                const { children, className, form, name, id, defaultValue } = props;
                const options = children.flat().map((option, optIndex) => {
                    const { key, props: optProps } = option;
                    const { value, disabled, hidden, children } = optProps;
                    return (
                        <option
                            key={key || optIndex} value={value}
                            disabled={disabled} hidden={hidden}
                        >
                            {children}
                        </option>
                    );
                });

                return (
                    <select
                        onDrop={handleDrop}
                        className={className} form={form}
                        name={name} id={id}
                        defaultValue={defaultValue}
                        {...register(`${index}_tables`, {
                            required: true
                        })}
                    >
                        {options}
                    </select>
                );
            }

            if (type === "input") {
                const { type: inputType, className } = props;
                return (
                    <input
                        type={inputType}
                        className={className}
                        {...register(`${index}_input`, {
                            required: true
                        })}
                    />
                );
            }
        });
    };

    /**
     * useEffect - Loads saved elements from sessionStorage and updates the query builder elements on component mount.
     */
    useEffect(() => {
        const savedElements = sessionStorage.getItem('savedFromElements');
        if (savedElements) {
            const parsedElements = JSON.parse(savedElements);
            const reactElements = loadElementFromDataFromSession(parsedElements);
            setElements(reactElements);
        }
    }, []);

    const onSubmitFrom = (data) => {
        const query = buildQuery(data, elements);
        handleQuery(query);
    }

    /**
     * Handles the form submission and execution of the SQL query.
     *
     * @function
     * @param {string} query - The SQL query to execute.
     */
    const handleQuery = (query) => {
        try {
            db.exec(query);
            sessionStorage.setItem('savedFromElements', JSON.stringify(elements));
            sessionStorage.setItem('savedFromQuery', JSON.stringify(query));
            clearResultTable();
            showResultTable();
            setQueryError(null);
        } catch (err) {
            clearResultTable();
            sessionStorage.removeItem('savedFromElements');
            sessionStorage.removeItem('savedFromQuery');
            setQueryError(err);
        }
    }

    /**
     * Constructs a SQL query from the data provided by the form elements.
     *
     * @function
     * @param {Object} data - The data collected from the form elements.
     * @param {Array<JSX.Element>} elements - The array of form elements.
     * @returns {string} The constructed SQL query.
     */
    const buildQuery = (data, elements) => {
        const queryComponents = elements
            .map((element, i) => {
                if (i % 2 !== 0) {
                    const key = `${i}_tables` in data ? `${i}_tables` : `${i}_input`;
                    return data[key];
                }
                return element.props.children;
            })
        return ["SELECT *", ...queryComponents].join(" ");
    };

    /**
     * Determines the new element to be added based on the last element in the query builder.
     *
     * @function
     * @param {JSX.Element} element - The last element in the query builder.
     * @returns {Array<JSX.Element>} An array containing the new element(s) to be added.
     */
    const getNewElement = (element) => {
        if (/^(table|attribute)/.test(element.props.className)) {
            const plus = document.getElementById("plus");
            plus.classList.add("disabled");
            return [<div className="placement element">Place join here</div>];
        }
        return createSelectTable();
    };

    /**
     * Updates the elements array with a new elements based on the last saved element.
     *
     * @function
     * @param {JSX.Element} lastElement - The last element in the elements array.
     */
    const updateElements = (lastElement) => {
        if (lastElement.props.className.includes('placement')) {
            setQueryError(new Error("please place a join"));
            return;
        }
        const newElement = getNewElement(lastElement);
        setElements((prevElements) => [...prevElements, ...newElement]);
    };

    /**
     * Handles the click event for the plus button, updating the query builder elements.
     *
     * @function
     */
    const handlePlus = () => {
        if (tables.length === 0) {
            setQueryError(new Error("please set the tables"))
            return;
        }
        const lastElement = elements.at(-1);
        updateElements(lastElement);
    };

    /**
     * Renders table options for the select element.
     *
     * @function
     * @returns {Array<JSX.Element>} An array of option elements for the table selector.
     */
    const renderTableOptions = () => {
        return tables.map((table, i) => (
            <option key={i} value={table}>
                {table}
            </option>
        ));
    };

    /**
     * Creates an 'AS' parameter and naming text input for the query builder.
     *
     * @function
     * @returns {Array<JSX.Element>} An array containing a 'AS' div element and an input element.
     */
    const createAsParameter = () => {
        return [
            <div className="start element">AS</div>,
            <input type="text" className="attribute as element"
                   {...register((elements.length + 2) + "_input", {
                       required: true
                   })}
            />
        ]
    }

    /**
     * Creates a table selection element and "AS" element after that for the query builder.
     *
     * @function
     * @returns {Array<JSX.Element>} An array containing a select element for table selection and an 'AS' parameter.
     */
    const createSelectTable = () => {
        if (tables.length === 0) return null;
        return [
            <select
                onDrop={handleDrop}
                className="table element" form="form"
                name="tables" id="tables" defaultValue=""
                {...register(elements.length + "_tables", {
                    required: true
                })}
            >
                {renderTableOptions()}
                <option disabled hidden key={"choose"} value="">
                    Choose table
                </option>
            </select>,
            ...createAsParameter()
        ];
    };

    /**
     * Creates a join element for the query builder based on the join type.
     *
     * @function
     * @param {string} joinType - The type of join to create.
     * @returns {Array<JSX.Element>} An array containing the join elements and following divs and inputs.
     */
    const createJoin = joinType => {
        let elements = [
            <div className="join element">{joinType}</div>,
            ...createSelectTable()
        ];

        if (joinType === "NATURAL JOIN") return elements;

        return [
            ...elements,
            <div className="start element">ON</div>,
            <input type="text" className="attribute element"
                   {...register((elements.length + 5) + "_input", {
                       required: true
                   })}
            />,
            <div className="start element">=</div>,
            <input type="text" className="attribute element"
                   {...register((elements.length + 7) + "_input", {
                       required: true,
                   })}
            />
        ];
    };

    /**
     * Updates the elements array with a join based on the last element and join type.
     *
     * @function
     * @param {JSX.Element} lastElement - The last element in the elements array.
     * @param {string} joinType - The type of join to add.
     */
    const updateElementsWithJoin = (lastElement, joinType) => {
        if (lastElement && lastElement.props.className.includes("placement")) {
            const newElements = createJoin(joinType);
            const updatedElements = [...elements.slice(0, -1), ...newElements];
            setElements(updatedElements);
        }
    };

    /**
     * Handles the drop event for draggable elements.
     *
     * @function
     * @param {React.DragEvent} e - The drop event.
     */
    const handleDrop = (e) => {
        dropHandler(e)
    };

    const dropHandler = e => {
        e.preventDefault();
        const lastElement = elements.at(-1);
        const joinType = e.dataTransfer.getData("joinType")
        updateElementsWithJoin(lastElement, joinType);
        const element = document.getElementById("plus");
        element.classList.remove("disabled");
    };

    const handleDragOver = e => {
        e.preventDefault();
    };

    /**
     * Clears the form elements and removes the saved data from the session storage.
     *
     * @function
     */
    const handleClear = () => {
        setQueryError(null);
        elements.filter(element => element.type === 'input' || element.type === 'select')
            .forEach(element => unregister(element.props.name));
        clearResultTable();
        sessionStorage.removeItem('savedFromQuery');
        sessionStorage.removeItem('savedFromElements');
        const element = document.getElementById("plus");
        element.classList.remove("disabled");
        setElements(startElements);
    };

    return (
        <div className="queryFormComponent">
            <form id="form" className="queryContainer"
                  onSubmit={onSubmitFrom}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
            >
                <div className="disabled element">SELECT</div>
                <div className="disabled element">*</div>
                {elements.map((element, index) => (<div key={index}>{element}</div>))}
                <div id="plus" className="element plus_button" onClick={handlePlus}>+</div>
            </form>
            {queryError && (<div className="query-error"> {queryError.toString()}.</div>)}
            <div className="button-panel">
                <PopupUpload/>
                <DbFileDownloadButton/>
                <Button onClick={handleClear} text="Clear" icon={<AiFillDelete/>}/>
                <Button onClick={() => handleSubmit(onSubmitFrom)()} text="Run" icon={<VscDebugStart/>}/>
            </div>
        </div>
    );
};

export default FromQueryForm;
