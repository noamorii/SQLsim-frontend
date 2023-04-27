import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import './SelectQueryForm.css';
import OptionsMenu from "./OptionsMenu";
import {useNavigate} from 'react-router-dom';

const SelectQueryForm = () => {
    const {register, handleSubmit} = useForm();
    const [queryError, setQueryError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const navigate = useNavigate();

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
        <input type='text' className='columns element'/>,
        loadFromQuery()
    ];
    const [elements, setElements] = useState(startElements);

    function onSubmitFrom() {
    }

    const onDrop = (e) => {
        e.preventDefault();
        const operationType = e.dataTransfer.getData("operation");
    };

    const renderDragArea = () => (
        <div className='drag-area' onDrop={onDrop}>
            <p>Drag element here</p>
        </div>
    );

    const handleDragOver = e => {
        e.preventDefault();
    };

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
        const { children } = container;
        return Array.prototype.indexOf.call(children, target);
    }

    const setupElements = (placementIndexes, elementIndex, operation) => {

        const newElement = <div className="element">{operation}</div>;
        const newElementIndex = elementIndex - placementIndexes.filter(index => index < elementIndex).length;
        const updatedElements = [
            ...elements.slice(0, newElementIndex),
            newElement,
            ...elements.slice(newElementIndex)
        ].filter(element => !element.props.className.includes("placement"));
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

    const handleDragging = (e, isDragging) => {
        if (isDragging) {
            const operation = e.dataTransfer.getData("operation");
            if (operation === "DISTINCT") {
                setElements(elements => [
                    elements[0],
                    <div onDragOver={(e) => handleDragOver(e)}
                         onDrop={(e) => handleDrop(e, operation)}
                         className="element placement">Place here</div>,
                    ...elements.slice(1)
                ]);
            }
        }

        setIsDragging(false);
    }

    return (
        <div className='selectQueryContainer'>
            <div className="formAndButtons">
                {isDragging ? renderDragArea() : (
                    <form id='form' className='selectQueryForm' onSubmit={onSubmitFrom}>
                        {elements.map((element, index) => {
                            const isLoaded = element.props.className.includes('loaded');
                            return (
                                <div className={`elementContainer ${isLoaded ? 'from' : ''}`} key={index}>
                                    {element}
                                </div>
                            );
                        })}
                    </form>
                )}
                <div className="buttonPanel">
                    <button>Hello</button>
                    <button>Hello</button>
                    <button>Hello</button>
                </div>
            </div>
            {queryError && <div className='query-error'> {queryError.toString()}.</div>}
            <div className='optionsMenu'>
                <OptionsMenu handleDragging={handleDragging}/>
            </div>
        </div>
    );
};

export default SelectQueryForm;
