import React, {useState} from 'react';
import {useForm} from "react-hook-form";
import "./SelectQueryForm.css";
import JoinsMenu from "../UI/SideMenu/Joins/JoinsMenu";

const SelectQueryForm = () => {
    const startElements = [
        <div className="start">SELECT</div>,
        <input type="text" className="columns"/>
    ];
    const {register, handleSubmit} = useForm();
    const [elements, setElements] = useState(startElements);
    const [queryError, setQueryError] = useState(null);

    function onSubmitFrom() {
    }


    return (
        <div className="selectQueryContainer">
            <form id="form" className="selectQueryForm" onSubmit={onSubmitFrom}>
                {elements.map((element, index) => (<div key={index}>{element}</div>))}
            </form>
            {queryError && (<div className="query-error"> {queryError.toString()}.</div>)}
            <div className="optionsMenu">...</div>
        </div>
    );
};

export default SelectQueryForm;
