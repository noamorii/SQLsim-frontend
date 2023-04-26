import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './SelectQueryForm.css';
import OptionsMenu from "./OptionsMenu";
import { useNavigate  } from 'react-router-dom';

const SelectQueryForm = () => {
    const { register, handleSubmit } = useForm();
    const [queryError, setQueryError] = useState(null);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/tables');
    }

    const savedQuery = sessionStorage.getItem('savedFromQuery');
    const loadFromQuery = () => {
        const element = savedQuery ? JSON.parse(savedQuery).split(' ').slice(2).join(' ')
                   : 'Click here to create FROM query';
        return <div onClick={handleClick} className='loaded element disabled'>{element}</div>
    };

    const startElements = [
        <div className='start element'>SELECT</div>,
        <input type='text' className='columns element' />,
        loadFromQuery()
    ];
    const [elements, setElements] = useState(startElements);

    function onSubmitFrom() {}

    return (
        <div className='selectQueryContainer'>
            <div className="formAndButtons">
                <form id='form' className='selectQueryForm' onSubmit={onSubmitFrom}>
                    {elements.map((element, index) => (
                        <div key={index}>{element}</div>
                    ))}
                </form>
                <div className="buttonPanel">
                    <button>Hello</button>
                    <button>Hello</button>
                    <button>Hello</button>
                </div>
            </div>
            {queryError && <div className='query-error'> {queryError.toString()}.</div>}
            <div className='optionsMenu'>
                <OptionsMenu/>
            </div>
        </div>
    );
};

export default SelectQueryForm;
