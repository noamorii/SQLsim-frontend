import React, {useContext, useState} from 'react';
import {Link} from "react-router-dom";
import {AiOutlineRight} from "react-icons/ai";
import './SideMenu.css';
import FromQueryForm from "./Form/FromQueryForm";
import JoinsMenu from "./Joins/JoinsMenu";
import ResultTable from "../Table/Result/ResultTable";
import {executeQuery} from "../../context/commonFunctions";
import {DbContext} from "../../context/context";
import FakeTable from "../Table/Result/FakeTable";

/**
 * SideMenu component serves as a side menu to create a FROM query, display join types, and show query results.
 *
 * @component
 * @returns {JSX.Element} The SideMenu component.
 */
const SideMenu = () => {
    const [showMenu, setShowMenu] = useState(true);
    const [showTable, setShowTable] = useState(false);
    const {db} = useContext(DbContext);
    const showSideMenu = () => setShowMenu(!showMenu);

    /**
     * Retrieves the stored query from the session storage.
     *
     * @function
     * @returns {string} The stored query as a string or an empty string if not found.
     */
    const getStoredQuery = () => {
        const query = sessionStorage.getItem('savedFromQuery');
        return query ? JSON.parse(query) : "";
    };

    /**
     * Executes the query and returns the table data.
     *
     * @function
     * @returns {*|{columns: [], values: []}} The table data from the executed query.
     */
    const getTableData = () => {
        const query = getStoredQuery();
        return executeQuery(db, query);
    }

    const showResultTable = () => {
        setShowTable(getStoredQuery() !== "");
    };

    const clearResultTable = () => {
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
                            : (<FakeTable message={"Create and run your query"}/>)
                        }
                    </div>
                </div>
            )}
        </div>
    );
};

export default SideMenu;
