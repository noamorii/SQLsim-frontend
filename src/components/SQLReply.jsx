import SelectQueryForm from "./visualisation/selectQuery/SelectQueryForm";
import "./SqlReply.css"
import ResultTable from "./UI/Table/Result/ResultTable";
import {executeQuery} from "./context/commonFunctions";
import React, {useContext, useState} from "react";
import {DbContext} from "./context/context";

const SqlReply = () => {
    const {db} = useContext(DbContext);
    const [showTable, setShowTable] = useState(false);

    const getTableData = () => {
        const query = getStoredQuery();
        return executeQuery(db, query);
    }

    const getStoredQuery = () => {
        const query = sessionStorage.getItem('savedSelectQuery');
        return query ? JSON.parse(query) : "";
    };

    const showResultTable = () => {
        setShowTable(getStoredQuery() !== "");
    };

    const clearResultTable = () => {
        setShowTable(false);
    };

    return (
        <div className="sqlReply">
            <div className="queryPlayground">
                <div className="selectForm">
                    <SelectQueryForm showResultTable={showResultTable} clearResultTable={clearResultTable}/>
                </div>
                <div className="resultTable">
                    <div className="from-table">
                        {showTable
                            ? (<ResultTable data={getTableData()}/>)
                            : (<div className="no-data-message">No records to display</div>)
                        }
                    </div>
                </div>
            </div>
            <div className="visualization">...</div>
        </div>
    );
};

export default SqlReply;
