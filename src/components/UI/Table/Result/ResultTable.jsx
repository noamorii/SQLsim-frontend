import React from 'react';
import style from "./ResultTable.module.css";
import "./ResultTable.module.css";

const ResultTable = (result) => {
    if (!result || !result.data ) {
        return <div> No results available </div>;
    }

    return (
        <div className={style.tableContainer}>
            <table>
                <thead>
                <tr>
                    {result.data && result.data.columns.map(column => (
                        <th key={column}>{column}</th>
                    ))}
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
