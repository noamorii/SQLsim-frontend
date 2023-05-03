import React from 'react';
import ResultTable from "./ResultTable";
import "./FakeTable.css"

const FakeTable = ({message}) => {
    const prepareFakeResult = () => {
        return {
                columns: ["Id", "Column2", "Column3", "Column4"],
                values: [
                    [1, "Cars", "Data", "House"],
                    [2, "Hello", "Data", "Table"],
                    [3, "Browser", "Java", "Welcome"],
                    [4, "Who", "Wardrobe", "Garage"]
                ]
        }
    }

    return (
        <div className="no-result-container">
            <label className="table-message">{message}</label>
            <div className="no-result-table">
                <ResultTable data={prepareFakeResult()}/>
            </div>
        </div>
    );
};

export default FakeTable;
