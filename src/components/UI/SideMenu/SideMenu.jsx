import React, {useContext, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {AiOutlineRight} from "react-icons/ai";
import './SideMenu.css';
import FromQueryForm from "./Form/FromQueryForm";
import JoinsMenu from "./Joins/JoinsMenu";
import ResultTable from "../Table/Result/ResultTable";
import {executeQuery} from "../../context/commonFunctions";
import {DbContext} from "../../context/context";

const SideMenu = () => {
    const [showMenu, setShowMenu] = useState(true);
    const [showTable, setShowTable] = useState(false);
    const {db} = useContext(DbContext);
    const showSideMenu = () => setShowMenu(!showMenu);

    const getStoredQuery = () => {
        const query = sessionStorage.getItem('savedFromQuery');
        return query ? JSON.parse(query) : "";
    };

    const getTableData = () => {
        const query = getStoredQuery();
        return executeQuery(db, query);
    }

    useEffect(() => {
        setShowTable(getStoredQuery() !== "");
    }, [sessionStorage.getItem('savedFromQuery')]);

    const showResultTable = () => {
        setShowTable(getStoredQuery() !== "");
    };

    const clearResultTable = () => {
        console.log("falseee")
        setShowTable(false);
    };

    return (
        <div className={showMenu ? "sideContent active" : "sideContent"}>
            <div className="sideMenu-toggle" onClick={showSideMenu}>
                <Link to='#' className="menu-bars">
                    <AiOutlineRight className={showMenu ? '' : 'rotate'}/>
                    <label>FROM clause</label>
                </Link>
            </div>
            {showMenu && (
                <div className="container">
                    <p className="editor-label">Create a FROM query:</p>
                    <div className="editor">
                        <FromQueryForm showResultTable={showResultTable} clearResultTable={clearResultTable}/>
                        <JoinsMenu/>
                    </div>
                    <div className="from-table">
                        {showTable
                            ? (<ResultTable data={getTableData()}/>)
                            : (<div>No data</div>)
                        }
                    </div>
                </div>
            )}
        </div>
    );
};

export default SideMenu;
