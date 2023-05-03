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

const SelectQueryForm = ({showResult, clearResult}) => {
    const [queryError, setQueryError] = useState(null);
    const [copied, setCopied] = useState(false);

    const {register, unregister, handleSubmit} = useForm();
    const navigate = useNavigate();
    const {db} = useContext(DbContext);

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

    const handleClick = () => {
        navigate('/tables');
    }

    const savedQuery = sessionStorage.getItem('savedFromQuery');
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

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);

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

    const findNewElementIndex = (target, container) => {
        const {children} = container;
        return Array.prototype.indexOf.call(children, target);
    }

    function createInputElement(condition) {
        return (
            <input
                type="text"
                className={`${condition} element`}
                {...register(`${elements.length + 1}_input`, { required: true })}
            />
        );
    }

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

    const createPlacementDiv = (operation) => {
        return (
            <div onDragOver={handleDragOver}
                 onDrop={(e) => handleDrop(e, operation)}
                 className="element placement">Place here</div>
        );
    }

    const containsOperation = (operation) => {
        return elements.some(element => element.props.children === operation);
    };


    const getElementsWithPlacement = (elements, operation, index) => {
        return [
            ...elements.slice(0, index),
            createPlacementDiv(operation),
            ...elements.slice(index)
        ];
    };

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

    const buildQuery = (data) => {
        let newQuery = ["SELECT"];
        if (elements.some( (element) =>
            element.type === 'div' && element.props.children === 'DISTINCT'
        )) {
            newQuery.push("DISTINCT");
        }
        newQuery.push(data.select_input);
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

    const onSubmitForm = (data) => {
        handleQuery("savedSelectQuery", buildQuery(data));
    }

    const showAllElements = () => {
        handleQuery("savedFromQuery", getStoredQuery("savedFromQuery"))
    }

    function cleanElements() {
        setElements(startElements);
        elements.filter(element => element.type === 'input')
                .forEach(element => unregister(element.props.name));
        clearResult();
        sessionStorage.removeItem('savedSelectQuery');
        setQueryError(null);
    }

    const renderElement = (element, index) => {
        const isLoaded = element.props.className.includes('loaded');
        const containerClassName = `elementContainer ${isLoaded ? 'from' : ''}`;
        return (
            <div className={containerClassName} key={index}>
                {element}
            </div>
        );
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') event.preventDefault();
    };

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
