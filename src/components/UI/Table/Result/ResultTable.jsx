import React from 'react';
import style from "./ResultTable.module.css";
import "./ResultTable.module.css";
import FakeTable from "./FakeTable";

/**
 * ResultTable component displays the query execution results in a tabular format.
 *
 * @component
 * @param {object} result - The result object after db execution containing data to display.
 * @returns {JSX.Element} The rendered ResultTable component.
 */
const ResultTable = (result) => {
    if (!result || !result.data )
        return <FakeTable message={"No results available"}/>;

    return (
        <div className={style.tableContainer}>
            <table>
                <thead>
                <tr>
                    {result.data && result.data.columns.map(
                        column => (<th key={column}>{column}</th>)
                    )}
                </tr>
                </thead>
                <tbody>
                {result.data && result.data.values.map(row => (
                    <tr key={row[0]}>
                        {row.map(cell => (
                            <td key={cell}>{cell}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResultTable;
