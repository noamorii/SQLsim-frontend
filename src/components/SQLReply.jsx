import SelectQueryForm from "./visualisation/SelectQueryForm";
import "./SqlReply.css"
import ResultTable from "./UI/Table/Result/ResultTable";

const SqlReply = () => {

    return (
        <div className="sqlReply">
            <div className="queryPlayground">
                <div className="selectForm">
                    <SelectQueryForm/>
                </div>
                <div className="resultTable">
                    <ResultTable/>
                </div>
            </div>
            <div className="visualization">...</div>
        </div>
    );
};

export default SqlReply;
