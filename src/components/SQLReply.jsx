import SelectQueryForm from "./visualisation/selectQuery/SelectQueryForm";
import "./SqlReply.css"
import ResultTable from "./UI/Table/Result/ResultTable";
import {executeQuery, getStoredQuery} from "./context/commonFunctions";
import React, {useContext, useState} from "react";
import {DbContext} from "./context/context";
import Visualization from "./visualisation/Visualization";
import FakeTable from "./UI/Table/Result/FakeTable";

/**
 * SqlReply component represents the SQL query playground and visualization section.
 * It allows users to enter and execute SQL queries, view query results in a table,
 * and visualize the data using interactive circles.
 *
 * @returns {JSX.Element} - The rendered SqlReply component.
 */
const SqlReply = () => {
    const {db} = useContext(DbContext);
    const [resultState, setResultState] = useState(false);
    const [currentTable, setCurrentTable] = useState("savedSelectQuery");

    const getTableData = (key) => {
        const query = getStoredQuery(key);
        return executeQuery(db, query);
    }

    const showResult = (key) => {
        setCurrentTable(key);
        setResultState(getStoredQuery(key) !== "");
    }
    const clearResult = () => setResultState(false);

    return (
        <div className="sqlReply">
            <div className="queryPlayground">
                <div className="selectForm">
                    <SelectQueryForm showResult={showResult} clearResult={clearResult}/>
                </div>
                <div className="resultTable">
                    <div className="from-table">
                        {resultState
                            ? (<ResultTable data={getTableData(currentTable)}/>)
                            : (<FakeTable message={"Create and run SELECT query"}/>)
                        }
                    </div>
                </div>
            </div>
            <div className="visualization">
                {resultState
                    ? (<Visualization query={currentTable}/>)
                    : (<div className="no-data">Create and run SELECT query</div>)
                }
            </div>
        </div>
    );
};

export default SqlReply;
