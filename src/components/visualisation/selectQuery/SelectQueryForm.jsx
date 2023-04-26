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
        const operationType = e.dataTransfer.getData("text");
    };

    const renderDragArea = () => (
        <div className='drag-area' onDrop={onDrop}>
            <p>Drag element here</p>
        </div>
    );

    const handleDragging = (boolean) => {
        setIsDragging(boolean);
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
