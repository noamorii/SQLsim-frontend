import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Link} from "react-router-dom";
import {AiOutlineClose} from "react-icons/all";
import './SideMenu.css';
import {SELECT_TABLES_QRY} from "../../context/DbQueryConsts";
import PopupUpload from "../Popup/PopupUpload";
import {executeQueryValues} from "../../context/commonFunctions";
import {DbContext} from "../../context/context";

const JOIN_TYPES = ["Inner Join", "Left Join", "Right Join", "Outer Join"];

const SideMenu = () => {
    const startElements = [<div className="start element">FROM</div>,];

    const [sideMenu, setSideMenu] = useState(true);
    const [elements, setElements] = useState(startElements);
    const {db} = useContext(DbContext);
    const [tables, setTables] = useState([]);

    const showSideMenu = () => setSideMenu(!sideMenu);

    const fetchTables = useMemo(() => {
        return async () => {
            const allTables = await executeQueryValues(db, SELECT_TABLES_QRY);
            setTables(allTables);
        };
    }, [db]);

    useEffect(() => {
        fetchTables().catch((error) => {
            console.error('Error fetching tables:', error);
        });
    }, [fetchTables]);

    const handlePlus = () => {
        if (tables.length === 0) return;
        let newElement;
        const lastElement = elements.at(-1);
        if (lastElement && lastElement.props.className.includes('table')) {
            newElement = <div className="placement element">Place join here</div>
        } else {
            newElement = createSelect();
        }
        setElements([...elements, newElement]);
    };

    const createSelect = () => {
        if (tables.length === 0) return;
        return (<select onDrop={(e) => {
            dropHandler(e)
        }} className="table element" name="tables" id="tables" defaultValue="">
            {tables.map((table, index) => (<option key={index} value={table}>
                {table}
            </option>))}
            <option disabled hidden key={"choose"} value="">
                Choose table
            </option>
        </select>);
    };

    function dragStartHandler(e, type) {
        e.dataTransfer.setData("joinType", type);
    }

    function dropHandler(e) {
        e.preventDefault();
        const lastElement = elements.at(-1);
        if (lastElement && lastElement.props.className.includes('placement')) {
            const newElement = <div className="join element">{e.dataTransfer.getData("joinType")}</div>;
            const updatedElements = [...elements];
            updatedElements.splice(-1, 1, newElement);
            setElements(updatedElements);
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    return (<div className="sideMenu">
        <div className={sideMenu ? "sideContent active" : "sideContent"}>
            <div className="sideMenu-toggle" onClick={showSideMenu}>
                <Link to='#' className="menu-bars">
                    <AiOutlineClose/>
                </Link>
            </div>
            <div className="container">
                <p>Hello some text here:</p>
                <div className="editor">
                    <div onDrop={(e) => {
                        dropHandler(e)
                    }} onDragOver={handleDragOver} className="queryContainer">
                        {elements.map((element, index) => (<div key={index}>{element}</div>))}
                        <div className="element plus_button" onClick={handlePlus}>+</div>
                    </div>

                    <div className="jonsMenu">
                        <p>Joins:</p>
                        <ul>
                            {JOIN_TYPES.map((joinType, index) =>
                                <li
                                    key={index} draggable={true}
                                    onDragStart={(e) => dragStartHandler(e, joinType)}
                                >
                                    {joinType}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
                <PopupUpload/>
            </div>
        </div>
    </div>);
};

export default SideMenu;
