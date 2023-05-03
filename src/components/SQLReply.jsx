import SelectQueryForm from "./visualisation/selectQuery/SelectQueryForm";
import "./SqlReply.css"
import ResultTable from "./UI/Table/Result/ResultTable";
import {executeQuery} from "./context/commonFunctions";
import React, {useContext, useState} from "react";
import {DbContext} from "./context/context";
import Visualisation from "./visualisation/Visualisation";
import FakeTable from "./UI/Table/Result/FakeTable";

const SqlReply = () => {
    const {db} = useContext(DbContext);
    const [resultState, setResultState] = useState(false);

    const getTableData = () => {
        const query = getStoredQuery();
        return executeQuery(db, query);
    }

    const getStoredQuery = () => {
        const query = sessionStorage.getItem('savedSelectQuery');
        return query ? JSON.parse(query) : "";
    };

    const showResult = () => setResultState(getStoredQuery() !== "");
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
                            ? (<ResultTable data={getTableData()}/>)
                            : (<FakeTable message={"No records to display"}/>)
                        }
                    </div>
                </div>
            </div>
            <div className="visualization">
                {resultState
                    ? (<Visualisation/>)
                    : (<div className="no-data-message">No records to display</div>)
                }
            </div>
        </div>
    );
};

export default SqlReply;
