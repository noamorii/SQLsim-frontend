import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './SelectQueryForm.css';
import OptionsMenu from "./OptionsMenu";

const SelectQueryForm = () => {
    const { register, handleSubmit } = useForm();
    const [queryError, setQueryError] = useState(null);

    const savedQuery = sessionStorage.getItem('savedFromQuery');
    const loadFromQuery = () => {
        const element = savedQuery ? JSON.parse(savedQuery).split(' ').slice(2).join(' ')
                   : 'Please create from query';
        return <div className='loaded element disabled'>{element}</div>
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
            <form id='form' className='selectQueryForm' onSubmit={onSubmitFrom}>
                {elements.map((element, index) => (
                    <div key={index}>{element}</div>
                ))}
            </form>
            {queryError && <div className='query-error'> {queryError.toString()}.</div>}
            <div className='optionsMenu'>
                <OptionsMenu/>
            </div>
        </div>
    );
};

export default SelectQueryForm;
