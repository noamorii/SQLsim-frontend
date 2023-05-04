import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import './SelectQueryForm.css';
import OptionsMenu from "./OptionsMenu";
import {useNavigate} from 'react-router-dom';
import {CONDITIONS} from "../../context/DbQueryConsts";
import Button from "../../UI/Buttons/Button";
import {VscDebugStart} from "react-icons/vsc";
import {DbContext} from "../../context/context";
import {AiFillCopy, AiFillDelete, AiOutlineCopy} from "react-icons/ai";
import {BiShow} from "react-icons/bi";
import {getStoredQuery} from "../../context/commonFunctions";

/**
 * SelectQueryForm is a React component that provides a form for building and executing SQL SELECT queries
 * using a drag-and-drop operation interface. Also provide buttons for different manipulation with output.
 *
 * @component
 * @param {Object} props - The props of the component.
 * @param {function} props.showResult - The function to show the query results in the form of a table and circular visualization.
 * @param {function} props.clearResult - The function to clear the table and visualization results.
 */
const SelectQueryForm = ({showResult, clearResult}) => {
    const [queryError, setQueryError] = useState(null);
    const [copied, setCopied] = useState(false);

    const {register, unregister, handleSubmit} = useForm();
    const navigate = useNavigate();
    const {db} = useContext(DbContext);

    const savedQuery = sessionStorage.getItem('savedFromQuery');

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
     * handleClick navigates to the '/tables' route when "Create From query" clicked.
     */
    const handleClick = () => {
        navigate('/tables');
    }

    /**
     * loadFromQuery returns a div containing the saved FROM query
     * from the sessionStorage or a message to create a FROM query.
     */
    const loadFromQuery = () => {
        const element = savedQuery
            ? JSON.parse(savedQuery).split(' ').slice(2).join(' ')
            : 'Please create a from query';
        return <div onClick={handleClick} className='loaded element disabled'>{element}</div>
    };

    const startElements = [
        <div className='start element'>SELECT</div>,
        <input type='text' className='columns element'
            {...register( "select_input", {
             required: true
            })}/>,
        loadFromQuery()
    ];
    const [elements, setElements] = useState(startElements);

    /**
     * handleDragOver prevents the default behavior of the dragOver event.
     * @param {Event} e - The event object.
     */
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);

    /**
     * findAllPlacementIndexes returns an array of indexes of the elements with the "placement" class.
     * It iterates over the direct children of the "form" container and checks for the "placement" class.
     *
     * @returns {Array<number>} An array of indexes of the elements with the "placement" class.
     */
    const findAllPlacementIndexes = () => {
        const formContainer = document.getElementById("form");
        const directChildren = Array.from(formContainer.children);
        return directChildren.reduce((acc, el, index) => {
            if (el.querySelector(".placement")) {
                acc.push(index);
            }
            return acc;
        }, []);
    };

    /**
     * findNewElementIndex returns the index of the target element within the children of the given container.
     *
     * @param {HTMLElement} target - The target element for which the index is being searched.
     * @param {HTMLElement} container - The container element containing the target element.
     * @returns {number} The index of the target element within the container's children.
     */
    const findNewElementIndex = (target, container) => {
        const {children} = container;
        return Array.prototype.indexOf.call(children, target);
    }

    /**
     * createInputElement creates an input element based on the given condition.
     * @param {string} condition - The condition string for the input element.
     * @returns {JSX.Element} - The input element JSX.
     */
    function createInputElement(condition) {
        return (
            <input
                type="text"
                className={`${condition} element`}
                {...register(`${elements.length + 1}_input`, { required: true })}
            />
        );
    }

    /**
     * createOperationInput chooses the case for creation of an input element based on the given operation.
     * @param {string} operation - The operation string for the input element.
     * @returns {JSX.Element|null} - The input element JSX or null if not applicable.
     */
    const createOperationInput = (operation) => {
        switch (operation) {
            case "WHERE":
                return createInputElement("condition");
            case "ORDER BY":
                return createInputElement("order");
            case "GROUP BY":
                return createInputElement("group");
            case "HAVING":
                return createInputElement("having");
            default:
                if (CONDITIONS.includes(operation))
                    return createInputElement("condition");
                return null;
        }
    }

    /**
     * setupElements updates the elements state by inserting new elements in the correct position.
     * Filters it from "placement" fields created while dragging an operation.
     * @param {number[]} placementIndexes - An array of placement indexes.
     * @param {number} elementIndex - The index of the new element.
     * @param {string} operation - The operation type of the new element.
     */
    const setupElements = (placementIndexes, elementIndex, operation) => {
        const newElements = [<div className="element">{operation}</div>];
        const newElementIndex = elementIndex - placementIndexes.filter(index => index < elementIndex).length;

        const newInput = createOperationInput(operation);
        if (newInput) newElements.push(newInput);

        const updatedElements = [
            ...elements.slice(0, newElementIndex),
            ...newElements,
            ...elements.slice(newElementIndex)
        ].filter(element =>
            !element.props.className.includes("placement"));
        setElements(updatedElements);
    };

    /**
     * handleDrop handles the drop event and updates the elements state with the dropped operation.
     * @param {Event} e - The event object.
     * @param {string} operation - The operation type of the new element.
     */
    function handleDrop(e, operation) {
        e.preventDefault();
        const formContainer = document.getElementById("form");
        e.target.textContent = operation;
        e.target.classList.remove("placement")
        const placementIndexes = findAllPlacementIndexes();
        const newElementIndex = findNewElementIndex(e.target.parentNode, formContainer);
        setupElements(placementIndexes, newElementIndex, operation);
    }

    const findElementIndexByClassname = (className) => {
        return elements.findIndex(element => element.props.className.includes(className));
    }

    /**
     * createPlacementDiv creates a div element for placing and dropping operations.
     * @param {string} operation - The operation type of the new element.
     * @returns {JSX.Element} - The div element JSX.
     */
    const createPlacementDiv = (operation) => {
        return (
            <div onDragOver={handleDragOver}
                 onDrop={(e) => handleDrop(e, operation)}
                 className="element placement">Place here</div>
        );
    }

    /**
     * containsOperation checks if an operation exists within the elements array.
     *
     * @param {string} operation - The operation to search for in the elements array.
     * @returns {boolean} True if the operation is found in the elements array, otherwise false.
     */
    const containsOperation = (operation) => {
        return elements.some(element => element.props.children === operation);
    };

    /**
     * getElementsWithPlacement inserts a placement div with the specified operation at the given index.
     * It returns a new array with the updated elements.
     *
     * @param {Array} elements - The array of elements to insert the placement div into.
     * @param {string} operation - The operation to include in the placement div.
     * @param {number} index - The index at which to insert the placement div.
     * @returns {Array} A new array with the placement div inserted at the specified index.
     */
    const getElementsWithPlacement = (elements, operation, index) => {
        return [
            ...elements.slice(0, index),
            createPlacementDiv(operation),
            ...elements.slice(index)
        ];
    };

    /**
     * handleDragging handles the drag and drop events, updating the elements state based on the dragged operation.
     * @param {Event} e - The event object.
     * @param {boolean} isDragging - A flag indicating if the element is being dragged.
     */
    const handleDragging = useCallback((e, isDragging) => {
        if (isDragging) {
            const operation = e.dataTransfer.getData("operation");
            if (operation === "DISTINCT" && !containsOperation(operation)) {
                setElements(getElementsWithPlacement(elements, operation, 1));
                return;
            }

            if (operation === "WHERE" && !containsOperation(operation)) {
                const fromQueryIndex = findElementIndexByClassname("loaded")
                if (fromQueryIndex !== -1)
                    setElements(getElementsWithPlacement(elements, operation, fromQueryIndex + 1));
                return;
            }

            if (operation === "ORDER BY" && !containsOperation(operation)) {
                setElements(getElementsWithPlacement(elements, operation, elements.length));
                return;
            }

            if (operation === "ASC" || operation === "DESC") {
                const fromQueryIndex = findElementIndexByClassname("order");
                if (fromQueryIndex !== -1 && !elements.at(fromQueryIndex + 1))
                    setElements(getElementsWithPlacement( elements, operation, fromQueryIndex + 1));
                return;
            }

            if (operation === "GROUP BY" && !containsOperation(operation)) {
                let operationIndex = findElementIndexByClassname("order");
                if (operationIndex === -1) {
                    operationIndex = elements.length
                } else operationIndex--;

                setElements(getElementsWithPlacement(elements, operation, operationIndex));
                return;
            }

            if (operation === "HAVING" && !containsOperation(operation) && containsOperation("GROUP BY")) {
                let operationIndex = findElementIndexByClassname("group") + 2;
                setElements(getElementsWithPlacement(elements, operation, operationIndex));
                return;
            }

            if (CONDITIONS.includes(operation)) {
                let newElements = elements;
                let conditionIndex = findElementIndexByClassname("condition");
                if (conditionIndex !== -1) {
                    if (operation !== "LIKE")
                        while (elements.at(conditionIndex + 1) && CONDITIONS.includes(elements.at(conditionIndex + 1).props.children)) {
                            conditionIndex += 2;
                        }
                    newElements = getElementsWithPlacement(elements, operation, conditionIndex + 1);
                }
                if (operation !== "LIKE") {
                    let havingIndex = findElementIndexByClassname("having");
                    if (havingIndex !== -1) {
                        while (elements.at(havingIndex + 1) && CONDITIONS.includes(elements.at(havingIndex + 1).props.children)) {
                            havingIndex += 2;
                        }
                        newElements = [...getElementsWithPlacement(newElements, operation, havingIndex + 2)];
                    }
                }
                setElements(newElements);
            }
            return;
        }
        setElements(elements.filter(element => !element.props.className.includes("placement")));
        }, [elements]);

    /**
     * buildQuery constructs the final SQL query string based on the form data and elements state.
     * @param {Object} data - The form data object.
     * @returns {string} - The SQL query string.
     */
    const buildQuery = (data) => {
        let newQuery = ["SELECT"];
        if (elements.some((element) => element.type === 'div' && element.props.children === 'DISTINCT')) {
            newQuery.push("DISTINCT");
        }
        newQuery.push(data.select_input);
        if (!savedQuery) return newQuery.join(" ");
        newQuery.push(savedQuery.split(" ").slice(2).join(" ").slice(0, -1));
        for (let i = newQuery.length; i < elements.length; i++) {
            if (elements[i].type === 'input') {
                newQuery.push(data[elements[i].props.name])
                continue;
            }
            newQuery.push(elements[i].props.children)
        }
        return newQuery.join(" ");
    };

    /**
     * handleQuery runs the given SQL query, storing it in sessionStorage if successful, or displaying an error if not.
     * @param {string} key - The sessionStorage key for showing result table and visualization.
     * @param {string} query - The SQL query string to execute.
     */
    function handleQuery(key, query) {
        try {
            db.exec(query);
            sessionStorage.setItem('savedSelectQuery', JSON.stringify(query));
            clearResult();
            showResult(key);
            setQueryError(null);
        } catch (err) {
            clearResult();
            sessionStorage.removeItem('savedSelectQuery');
            setQueryError(err);
        }
    }

    /**
     * onSubmitForm handles the form submission, calling handleQuery with the built query string.
     * @param {Object} data - The form data object.
     */
    const onSubmitForm = (data) => {
        handleQuery("savedSelectQuery", buildQuery(data));
    }

    /**
     * showAllElements runs the saved FROM query, displaying all the results or an error if no query is saved.
     */
    const showAllElements = () => {
        const query = getStoredQuery("savedFromQuery");
        if (query === "") {
            setQueryError("Please create a from query");
            return;
        }
        handleQuery("savedFromQuery", getStoredQuery("savedFromQuery"))
    }

    /**
     * cleanElements resets the elements state, clears the results, and removes the saved query from sessionStorage.
     */
    function cleanElements() {
        setElements(startElements);
        elements.filter(element => element.type === 'input')
                .forEach(element => unregister(element.props.name));
        clearResult();
        sessionStorage.removeItem('savedSelectQuery');
        setQueryError(null);
    }

    /**
     * renderElement wraps the given element in a div with the appropriate className.
     * @param {JSX.Element} element - The element to wrap.
     * @param {number} index - The index of the element in the elements array.
     * @returns {JSX.Element} - The wrapped element JSX.
     */
    const renderElement = (element, index) => {
        const isLoaded = element.props.className.includes('loaded');
        const containerClassName = `elementContainer ${isLoaded ? 'from' : ''}`;
        return (
            <div className={containerClassName} key={index}>
                {element}
            </div>
        );
    };

    /**
     * handleKeyPress prevents sending the form by pressing the 'Enter' key on the form.
     * @param {KeyboardEvent} event - The event object representing the key press event.
     */
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') event.preventDefault();
    };

    /**
     * copyElements copies the built query to the clipboard.
     * It updates the copied state to true and then resets it after a short delay.
     * Change the related button text and icon.
     *
     * @async
     * @param {Object} data - The form data object containing the input values.
     *
     * The function handles the following error:
     * @throws {Error} Will throw an error if copying to the clipboard fails.
     */
    async function copyElements(data) {
        const toCopy = buildQuery(data);
        try {
            await navigator.clipboard.writeText(toCopy);
            setCopied(true);
            resetCopiedState();
        } catch (err) {
            console.error('Failed to copy text: ' + err);
        }
    }

    const resetCopiedState = () => {
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    return (
        <div className='selectQueryContainer'>
            <div className="formAndButtons">
                <form id="form" className="selectQueryForm" onKeyDown={() => {}}
                      onSubmit={onSubmitForm} onKeyPress={handleKeyPress}>
                    {elements.map(renderElement)}
                </form>
                {queryError && <div className='query-error'> {queryError.toString()}.</div>}
                <div className="buttonPanel">
                    <Button onClick={showAllElements} text="Show All" icon={<BiShow/>}/>
                    <Button onClick={cleanElements} text="Clear" icon={<AiFillDelete/>}/>
                    <Button
                        onClick={handleSubmit(copyElements)}
                        text={copied ? "Copied!" : "Copy"}
                        icon={copied ? <AiFillCopy /> : <AiOutlineCopy />}
                    />
                    <Button onClick={handleSubmit(onSubmitForm)} text="Run" icon={<VscDebugStart/>}/>
                </div>
            </div>
            <div className='optionsMenu'>
                <OptionsMenu handleDragging={handleDragging}/>
            </div>
        </div>
    );
};

export default SelectQueryForm;
