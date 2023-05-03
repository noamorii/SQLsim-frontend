import React, {useContext, useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {AiOutlineRight} from "react-icons/ai";
import './SideMenu.css';
import FromQueryForm from "./Form/FromQueryForm";
import JoinsMenu from "./Joins/JoinsMenu";
import ResultTable from "../Table/Result/ResultTable";
import {executeQuery, getStoredQuery} from "../../context/commonFunctions";
import {DbContext} from "../../context/context";
import FakeTable from "../Table/Result/FakeTable";
import Button from "../Buttons/Button";
import {VscDebugStart} from "react-icons/vsc";

/**
 * SideMenu component serves as a side menu to create a FROM query, display join types, and show query results.
 *
 * @component
 * @returns {JSX.Element} The SideMenu component.
 */
const SideMenu = () => {
    const [showMenu, setShowMenu] = useState(true);
    const [showTable, setShowTable] = useState(false);
    const [currentQuery, setCurrentQuery] = useState("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    const navigate = useNavigate();
    const {db} = useContext(DbContext);

    const showSideMenu = () => setShowMenu(!showMenu);

    useEffect(() => {
        const storedQuery = getStoredQuery("savedFromQuery");
        setCurrentQuery(storedQuery);
    }, []);

    /**
     * Executes the query and returns the table data.
     *
     * @function
     * @returns {*|{columns: [], values: []}} The table data from the executed query.
     */
    const getTableData = () => {
        const query = getStoredQuery("savedFromQuery");
        return executeQuery(db, query);
    }

    const showResultTable = () => {
        const query = getStoredQuery("savedFromQuery");
        setCurrentQuery(query);
        setShowTable(query !== "");
    };

    const clearResultTable = () => {
        setShowTable(false);
        setCurrentQuery("")
    };

    const redirectToEditor = () => {
        navigate('/editor');
    }

    return (
        <div className={showMenu ? "sideContent active" : "sideContent"}>
            <div className="sideMenu-toggle" onClick={showSideMenu}>
                <Link to='#' className="menu-bars">
                    <AiOutlineRight className={showMenu ? '' : 'rotate'}/>
                    <label>Create a FROM query</label>
                </Link>
            </div>
            {showMenu && (
                <div className="container">
                    <div className="editor">
                        <FromQueryForm showResultTable={showResultTable} clearResultTable={clearResultTable}/>
                        <JoinsMenu/>
                    </div>
                    <div className="from-table">
                        {showTable
                            ? (<ResultTable data={getTableData()}/>)
                            : (<FakeTable message={"Create and run your query"}/>)
                        }
                    </div>
                    {currentQuery
                        ? (
                            <div className="query-panel">
                                <div className="current-query">Current query: {currentQuery}</div>
                                <Button text="Continue" onClick={redirectToEditor} icon={<VscDebugStart/>}/>
                            </div>)
                        : null
                    }
                </div>
            )}
        </div>
    );
};

export default SideMenu;
